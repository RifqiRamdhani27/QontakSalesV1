from django.db.models import Q
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import BasePermission, SAFE_METHODS

SETTINGS_MODULES = {
    "company": ("Company setting",),
    "agents": ("Agents",),
    "user-management": ("User management: User list", "User management: Custom role"),
    "sales": ("Sales: Form settings", "Sales: Invoice reminder"),
    "purchases": ("Purchase",),
    "products": ("Product: Good & Services", "Product: Warehouse"),
    "productions": ("Production",),
    "template": (
        "Email Template: Sales Invoice", "Email Template: Sales Quote", "Email Template: Sales Order",
        "Email Template: Purchase Order", "PDF Template: Customize PDF",
        "Whatsapp Template: Sales Invoice", "Whatsapp Template: Sales Order",
    ),
    "custom-fields": ("Custom fields",),
    "account-mapping": ("Account Mapping",),
    "billings": ("Billings",),
    "approval-rules": ("Approval Rules",),
    "tagging-rules": ("Tagging Rules",),
}
ACTIONS = {"view": "see", "create": "create", "edit": "edit", "delete": "can_delete"}
COLUMNS = {"view": "View", "create": "Create/Add", "edit": "Edit", "delete": "Delete"}
TEMPLATE_FEATURES = {
    "email_sales_invoice": "Email Template: Sales Invoice",
    "email_sales_quote": "Email Template: Sales Quote",
    "email_sales_order": "Email Template: Sales Order",
    "email_purchase_order": "Email Template: Purchase Order",
    "whatsapp_sales": "Whatsapp Template: Sales Invoice",
    "whatsapp_order": "Whatsapp Template: Sales Order",
    "pdf_general": "PDF Template: Customize PDF",
    "pdf_customize": "PDF Template: Customize PDF",
    "pdf_sales_invoice": "PDF Template: Customize PDF",
    "pdf_sales_order": "PDF Template: Customize PDF",
    "pdf_purchase_invoice": "PDF Template: Customize PDF",
}


def settings_grants(role_config, roles=(), owner=False):
    features = {feature: {action: False for action in ACTIONS} for items in SETTINGS_MODULES.values() for feature in items}
    config = role_config if isinstance(role_config, dict) else {}
    existing = config.get("existing", [])
    selected = {key for key in existing if isinstance(key, str)} if isinstance(existing, list) else set()
    selected.update(role.code for role in roles if role.is_default)
    list_manager = config.get("list_manager") is True

    def grant(names, actions):
        for name in names:
            for action in actions:
                features[name][action] = True

    if owner:
        grant(features, ACTIONS)
    else:
        general = [name for name in features if name != "Billings"]
        if "ultimate" in selected:
            grant(general, ACTIONS if list_manager else ("view",))
            grant(("User management: User list",), ("view", "create"))
        if "administrator" in selected:
            grant(general, ("view",))
        for key, module in (("sales", "sales"), ("purchasing", "purchases"), ("stockist", "products"), ("productions", "productions")):
            if key in selected:
                grant(SETTINGS_MODULES[module], ("view",))
        authority_cells = config.get("authority", [])
        cells = {cell for cell in authority_cells if isinstance(cell, str)} if isinstance(authority_cells, list) else set()
        for feature in features:
            for action, column in COLUMNS.items():
                if f"Setting.{feature}.{column}" in cells:
                    features[feature][action] = True
        for role in roles:
            for authority in role.authorities.all():
                if authority.feature == "Setting" and authority.sub_feature in features:
                    for action, field in ACTIONS.items():
                        if getattr(authority, field) is True:
                            features[authority.sub_feature][action] = True
    modules = {
        module: {action: any(features[name][action] for name in names) for action in ACTIONS}
        for module, names in SETTINGS_MODULES.items()
    }
    templates = {key: features[feature].copy() for key, feature in TEMPLATE_FEATURES.items()}
    return {"modules": modules, "features": features, "templates": templates, "is_owner": owner}


def get_settings_access(user):
    active = bool(user and user.is_authenticated and user.is_active and user.status == "active" and user.company_id)
    if not active:
        return settings_grants({})
    owner = user.role == "MANAGER"
    roles = [] if owner else list(user.roles.filter(Q(company_id=user.company_id) | Q(company__isnull=True)).prefetch_related("authorities"))
    access = settings_grants(user.role_config, roles, owner)
    access["user_id"] = user.pk
    return access


def request_settings_access(request):
    if not hasattr(request, "_settings_access"):
        request._settings_access = get_settings_access(request.user)
    return request._settings_access


def validate_settings_role_config(value):
    if not isinstance(value, dict):
        raise ValidationError({"role_config": "Role config harus berupa objek JSON."})
    for field in ("existing", "authority", "restriction"):
        if field in value and (not isinstance(value[field], list) or any(not isinstance(item, str) for item in value[field])):
            raise ValidationError({"role_config": f"{field} harus berupa list teks."})
    if "list_manager" in value and not isinstance(value["list_manager"], bool):
        raise ValidationError({"role_config": "list_manager harus berupa boolean."})
    return value


def validate_settings_assignment(actor, data, instance=None):
    if "role_config" in data:
        validate_settings_role_config(data["role_config"])
    if actor.role == "MANAGER" or not ({"role_config", "roles"} & data.keys()):
        return
    config = data.get("role_config", instance.role_config if instance else {})
    roles = data.get("roles", list(instance.roles.prefetch_related("authorities")) if instance else [])
    target = settings_grants(config, roles)
    allowed = get_settings_access(actor)
    for feature, rights in target["features"].items():
        if any(granted and not allowed["features"][feature][action] for action, granted in rights.items()):
            raise PermissionDenied("Tidak dapat memberikan izin Settings melebihi izin akun sendiri.")


def validate_settings_authorities(actor, authorities):
    if actor.role == "MANAGER":
        return
    allowed = get_settings_access(actor)["features"]
    for authority in authorities:
        if authority["feature"] != "Setting":
            continue
        rights = allowed.get(authority["sub_feature"], {})
        if any(authority.get(field) and not rights.get(action, False) for action, field in ACTIONS.items()):
            raise PermissionDenied("Tidak dapat memberikan izin Settings melebihi izin akun sendiri.")


class SettingsPermission(BasePermission):
    message = "Role akun ini tidak memiliki izin untuk pengaturan tersebut."

    def has_permission(self, request, view):
        access = request_settings_access(request)
        if access["is_owner"]:
            return True
        action = getattr(view, "action", "")
        if action == "transfer_ownership":
            return False
        if getattr(view, "settings_role_choices", False) and action == "list":
            users = access["features"]["User management: User list"]
            if users["create"] or users["edit"]:
                return True
        if request.method in SAFE_METHODS:
            required = "view"
        elif action in ("resend_invitation", "create"):
            required = "create"
        elif request.method == "DELETE":
            required = "delete"
        elif request.method == "POST" and action not in ("reorder", "bulk"):
            required = "create"
        else:
            required = "edit"
        getter = getattr(view, "get_settings_features", None)
        features = getter() if getter else (getattr(view, "settings_feature", None),)
        return any(access["features"].get(feature, {}).get(required, False) for feature in features)
