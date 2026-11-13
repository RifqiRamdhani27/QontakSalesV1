from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers

from qontak_sales.apps.accounts_coa.models import AccountCOA
from qontak_sales.apps.customers.models import Customer

from .invitations import find_invitation
from .models import Role
from .settings_models import AccountMapping, ApprovalRule, Billing, CompanyProductionSetting, CustomField, Invitation, InvoiceReminder, InvoiceReminderInterval, ProductBatchReminder, ProductSetting, PurchaseSetting, SalesFormSetting, TaggingRule

User = get_user_model()

CUSTOM_FIELD_SUB_PAGES = {
    "sales": [
        "Sales Order",
        "Sales Invoice",
        "Sales Quotation",
        "Sales Delivery",
        "Sales Return",
        "Down payment receipt",
        "Proforma invoice",
        "Proforma order",
    ],
    "purchases": [
        "Purchase Order",
        "Purchase Invoice",
        "Purchase Quotation",
        "Purchase Request",
        "Purchase Return",
        "Purchase Quote",
        "Purchase Delivery",
    ],
    "expenses": ["Expense"],
    "products": [],
}


class ProfileUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, allow_blank=False)
    remove_avatar = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "phone", "avatar", "remove_avatar"]

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value

    def validate_avatar(self, value):
        if value and value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Ukuran foto maksimal 5 MB.")
        return value

    def update(self, instance, validated_data):
        remove_avatar = validated_data.pop("remove_avatar", False)
        instance = super().update(instance, validated_data)
        if remove_avatar and instance.avatar:
            instance.avatar.delete(save=False)
            instance.avatar = None
            instance.save(update_fields=["avatar"])
        return instance

class InviteMemberSerializer(serializers.Serializer):
    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        if request is not None and request.user.company_id is not None:
            fields["roles"].child.queryset = Role.objects.filter(Q(company=request.user.company) | Q(company__isnull=True))
        else:
            fields["roles"].child.queryset = Role.objects.none()
        return fields

    def validate_role_config(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Role config harus berupa objek JSON.")
        return value

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    type = serializers.ChoiceField(choices=["member", "partner"], default="member")
    access_time_limit = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    roles = serializers.ListField(
        child=serializers.PrimaryKeyRelatedField(queryset=Role.objects.all()),
        required=False,
    )
    role_config = serializers.JSONField(required=False, default=dict)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username sudah dipakai.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value.lower().strip()

class MemberSerializer(serializers.ModelSerializer):
    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        if request is not None and request.user.company_id is not None:
            fields["roles"].child_relation.queryset = Role.objects.filter(Q(company=request.user.company) | Q(company__isnull=True))
        else:
            fields["roles"].child_relation.queryset = Role.objects.none()
        return fields

    def validate_role_config(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Role config harus berupa objek JSON.")
        return value

    def validate_status(self, value):
        if self.instance and self.instance.role == "MANAGER" and value != "active":
            raise serializers.ValidationError("Owner harus tetap aktif.")
        if self.instance and value == "active" and not self.instance.has_usable_password():
            raise serializers.ValidationError("User harus menerima undangan terlebih dahulu.")
        return value

    def update(self, instance, validated_data):
        if "status" in validated_data:
            validated_data["is_active"] = validated_data["status"] == "active"
        return super().update(instance, validated_data)



    roles = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Role.objects.all(), required=False
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "status",
            "type",
            "access_time_limit",
            "role",
            "roles",
            "role_config",
        ]
        read_only_fields = ["id", "username", "role"]

    def validate_email(self, value):
        value = value.lower().strip()
        if value and User.objects.filter(email__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Email sudah dipakai.")
        return value

class AcceptInvitationSerializer(serializers.Serializer):

    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Konfirmasi password tidak sama."}
            )

        invitation = find_invitation(attrs["token"].strip())
        if invitation is None or not invitation.is_usable:
            raise serializers.ValidationError(
                {"token": "Undangan tidak valid atau sudah kedaluwarsa."}
            )
        if invitation.user.status != "invited":
            raise serializers.ValidationError({"token": "Undangan ini sudah tidak berlaku."})

        try:
            validate_password(attrs["password"], user=invitation.user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})

        attrs["invitation"] = invitation
        return attrs

    def save(self):
        with transaction.atomic():
            invitation = Invitation.objects.select_for_update().select_related("user").get(pk=self.validated_data["invitation"].pk)
            if not invitation.is_usable or invitation.user.status != "invited":
                raise serializers.ValidationError({"token": "Undangan ini sudah tidak berlaku."})
            user = invitation.user
            user.set_password(self.validated_data["password"])
            user.status = "active"
            user.is_active = True
            user.save(update_fields=["password", "status", "is_active"])
            invitation.accepted_at = timezone.now()
            invitation.save(update_fields=["accepted_at", "updated_at"])
        return user

class CustomFieldSerializer(serializers.ModelSerializer):
    sub_pages = serializers.ListField(
        child=serializers.CharField(max_length=50), required=False
    )
    options = serializers.ListField(
        child=serializers.CharField(allow_blank=True, max_length=100),
        required=False,
        max_length=50,
    )
    default_value = serializers.CharField(
        max_length=100, required=False, allow_blank=True, allow_null=True
    )
    max_chars = serializers.IntegerField(
        min_value=1, max_value=1000, required=False, allow_null=True
    )
    affix_text = serializers.CharField(max_length=30, required=False, allow_blank=True)

    class Meta:
        model = CustomField
        fields = [
            "id",
            "name",
            "page",
            "sub_pages",
            "field_type",
            "status",
            "is_required",
            "show_in_print",
            "max_chars",
            "use_decimal",
            "affix_type",
            "affix_text",
            "date_default",
            "allow_multiple",
            "options",
            "default_value",
            "sort_order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "sort_order", "created_at", "updated_at"]

    def validate_status(self, value):
        if value == "deleted":
            raise serializers.ValidationError(
                "Gunakan aksi hapus untuk menghapus custom field."
            )
        return value

    def validate_options(self, value):
        cleaned = [item.strip() for item in value]
        if any(not item for item in cleaned):
            raise serializers.ValidationError("Opsi dropdown tidak boleh kosong.")
        lowered = [item.lower() for item in cleaned]
        if len(set(lowered)) != len(lowered):
            raise serializers.ValidationError("Opsi dropdown tidak boleh sama.")
        return cleaned

    def _current(self, attrs, key):
        if key in attrs:
            return attrs[key]
        if self.instance is not None:
            return getattr(self.instance, key)
        return CustomField._meta.get_field(key).get_default()

    def validate(self, attrs):
        company = self.context["request"].user.company
        if company is None:
            raise serializers.ValidationError(
                {"detail": "User belum terhubung ke company."}
            )
        if self.instance is not None and self.instance.status == "deleted":
            raise serializers.ValidationError(
                {"detail": "Custom field yang sudah dihapus tidak dapat diubah."}
            )

        page = self._current(attrs, "page")
        field_type = self._current(attrs, "field_type")
        name = self._current(attrs, "name")

        allowed_sub_pages = CUSTOM_FIELD_SUB_PAGES[page]
        if allowed_sub_pages:
            selected = self._current(attrs, "sub_pages")
            if any(item not in allowed_sub_pages for item in selected):
                raise serializers.ValidationError({"sub_pages": "Halaman tidak valid."})
            if not selected:
                raise serializers.ValidationError(
                    {"sub_pages": "Pilih minimal satu halaman."}
                )
            attrs["sub_pages"] = [item for item in allowed_sub_pages if item in selected]
        else:
            attrs["sub_pages"] = []

        duplicates = CustomField.objects.filter(
            company=company, page=page, name__iexact=name
        ).exclude(status="deleted")
        if self.instance is not None:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists():
            raise serializers.ValidationError(
                {"name": "Custom field dengan nama ini sudah ada di halaman tersebut."}
            )

        if self.instance is None:
            used = (
                CustomField.objects.filter(company=company)
                .exclude(status="deleted")
                .count()
            )
            if used >= CustomField.QUOTA:
                raise serializers.ValidationError(
                    {"detail": "Kuota custom field sudah habis."}
                )

        if field_type != "text":
            attrs["max_chars"] = None

        if field_type == "number":
            affix_type = self._current(attrs, "affix_type")
            affix_text = (self._current(attrs, "affix_text") or "").strip()
            if affix_type == "none":
                affix_text = ""
            elif not affix_text:
                raise serializers.ValidationError(
                    {"affix_text": "Teks tambahan wajib diisi."}
                )
            attrs["affix_text"] = affix_text
        else:
            attrs["use_decimal"] = False
            attrs["affix_type"] = "none"
            attrs["affix_text"] = ""

        if field_type != "date":
            attrs["date_default"] = "none"

        if field_type == "dropdown":
            options = self._current(attrs, "options")
            if not options:
                raise serializers.ValidationError(
                    {"options": "Minimal satu opsi wajib diisi."}
                )
            default_value = self._current(attrs, "default_value") or None
            if default_value is not None and default_value not in options:
                raise serializers.ValidationError(
                    {"default_value": "Opsi utama harus salah satu dari opsi yang ada."}
                )
            attrs["default_value"] = default_value
        else:
            attrs["options"] = []
            attrs["default_value"] = None
            attrs["allow_multiple"] = False

        return attrs

class CustomFieldReorderSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=False, max_length=100
    )

    def validate_ids(self, value):
        if len(set(value)) != len(value):
            raise serializers.ValidationError("Daftar id tidak boleh duplikat.")
        return value

class AccountMappingSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        company = self.context["request"].user.company
        code = attrs.get("account_code", self.instance.account_code if self.instance else "")
        account = AccountCOA.objects.filter(company=company, kode_akun=code).first()
        if account is None:
            raise serializers.ValidationError({"account_code": "Akun perusahaan tidak ditemukan."})
        attrs["account_name"] = account.nama_akun
        target_type = attrs.get("target_type", self.instance.target_type if self.instance else "company")
        target_id = attrs.get("target_id", self.instance.target_id if self.instance else "")
        account_type = attrs.get("account_type", self.instance.account_type if self.instance else "")
        duplicates = AccountMapping.objects.filter(company=company, account_type=account_type, target_type=target_type, target_id=target_id)
        if self.instance:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists() and not self.context.get("bulk"):
            raise serializers.ValidationError({"target_id": "Mapping sudah ada."})
        return attrs

    class Meta:
        model = AccountMapping
        fields = [
            "id",
            "account_type",
            "target_type",
            "target_id",
            "account_code",
            "account_name",
            "is_active",
            "mapping_options",
        ]

    def validate_account_code(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Kode akun wajib diisi.")
        return value

    def validate_mapping_options(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Mapping options harus berupa objek JSON.")
        return value

class BillingSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0)
    tax_amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0, required=False)

    def get_fields(self):
        fields = super().get_fields()
        fields["customer"].read_only = True
        return fields

    customer_name = serializers.CharField(source="customer.name", read_only=True)

    class Meta:
        model = Billing
        fields = [
            "id",
            "invoice_number",
            "invoice_date",
            "due_date",
            "customer",
            "customer_name",
            "amount",
            "tax_amount",
            "total_amount",
            "status",
            "payment_method",
            "billing_period",
            "notes",
            "paid_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "total_amount", "paid_at", "created_at", "updated_at"]

    def validate(self, attrs):
        amount = attrs.get("amount", self.instance.amount if self.instance else 0)
        tax_amount = attrs.get("tax_amount", self.instance.tax_amount if self.instance else 0)
        invoice_date = attrs.get("invoice_date", self.instance.invoice_date if self.instance else None)
        due_date = attrs.get("due_date", self.instance.due_date if self.instance else None)
        if invoice_date and due_date and due_date < invoice_date:
            raise serializers.ValidationError({"due_date": "Tanggal jatuh tempo tidak boleh sebelum tanggal invoice."})
        attrs["total_amount"] = amount + tax_amount
        status = attrs.get("status", self.instance.status if self.instance else "draft")
        if status == "paid":
            attrs["paid_at"] = self.instance.paid_at if self.instance and self.instance.paid_at else timezone.now()
        else:
            attrs["paid_at"] = None
        return attrs

class ApprovalRuleSerializer(serializers.ModelSerializer):
    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        company = request.user.company if request else None
        fields["approver_role"].queryset = Role.objects.filter(Q(company=company) | Q(company__isnull=True)) if company else Role.objects.none()
        fields["approver_user"].queryset = User.objects.filter(company=company) if company else User.objects.none()
        return fields

    approver_role_name = serializers.CharField(source="approver_role.name", read_only=True)
    approver_user_name = serializers.CharField(
        source="approver_user.get_full_name", read_only=True
    )

    class Meta:
        model = ApprovalRule
        fields = [
            "id",
            "name",
            "description",
            "rule_type",
            "amount_threshold",
            "approver_role",
            "approver_role_name",
            "approver_user",
            "approver_user_name",
            "is_active",
            "condition",
            "notification_template",
        ]
        read_only_fields = ["id"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Nama rule wajib diisi.")
        return value

    def validate_condition(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Condition harus berupa objek JSON.")
        if value:
            company = self.context["request"].user.company
            users = set(User.objects.filter(company=company).exclude(status="inactive").values_list("username", flat=True))
            customers = set(Customer.objects.filter(agent__company=company).values_list("name", flat=True))
            for key, allowed in [("createdByUsers", users), ("createdForCustomers", customers)]:
                selected = value.get(key, [])
                if not isinstance(selected, list) or any(not isinstance(item, str) or item not in allowed for item in selected):
                    raise serializers.ValidationError(f"{key} tidak valid untuk perusahaan ini.")
            levels = value.get("levels", value.get("steps", []))
            if not isinstance(levels, list):
                raise serializers.ValidationError("Level approval harus berupa list.")
            for level in levels:
                if not isinstance(level, dict) or not isinstance(level.get("approvers", []), list):
                    raise serializers.ValidationError("Approver tidak valid.")
                if any(not isinstance(item, str) or item not in users for item in level.get("approvers", [])):
                    raise serializers.ValidationError("Approver tidak valid untuk perusahaan ini.")
        return value

class TaggingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaggingRule
        fields = [
            "id",
            "name",
            "description",
            "tag_type",
            "transaction_type",
            "tag_mapping",
            "is_active",
            "default_tag",
            "tag_set",
        ]
        read_only_fields = ["id"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Nama rule wajib diisi.")
        return value

    def validate_tag_mapping(self, value):
        if value is not None and not isinstance(value, dict):
            raise serializers.ValidationError("Tag mapping harus berupa objek JSON.")
        if value:
            users = set(User.objects.filter(company=self.context["request"].user.company).exclude(status="inactive").values_list("username", flat=True))
            makers = value.get("transactionMakers", [])
            if not isinstance(makers, list) or any(not isinstance(item, str) or item not in users for item in makers):
                raise serializers.ValidationError("User tagging tidak valid untuk perusahaan ini.")
        return value

SIGNATURE_DOCUMENT_TYPES = [
    "Sales Invoice",
    "Sales Order",
    "Sales Quote",
    "Sales Return",
    "Receive Payment",
    "Sales Order Payment",
    "Purchase Invoice",
    "Purchase Order",
    "Purchase Return",
    "Payment",
]

PDF_DATE_FORMATS = [
    "28-08-2023",
    "28 Aug 2023",
    "28 August 2023",
    "08/28/2023",
    "08-28-2023",
]

PDF_HEADER_FLAGS = [
    "showLogo",
    "applyForBoth",
    "showCompanyName",
    "showCompanyAddress",
    "showCompanyEmail",
    "showCompanyPhone",
    "showCompanyWeb",
    "showCompanyFax",
    "showCompanyTax",
    "showRecipientName",
    "showRecipientCompany",
    "showRecipientFullName",
    "showRecipientAddress",
    "showRecipientTelephone",
    "showRecipientEmail",
    "showCustomFields",
]

PDF_HEADER_TEXTS = [
    "titleId",
    "titleEn",
    "labelCompanyEmail",
    "labelCompanyPhone",
    "labelRecipientName",
    "labelRecipientCompany",
    "labelRecipientFullName",
    "labelRecipientAddress",
    "labelRecipientTelephone",
    "labelRecipientEmail",
]

PDF_CONTENT_FLAGS = [
    "showCustomerRef",
    "showOtherDpp",
    "showTags",
    "showWarehouse",
    "showTableProduct",
    "showTableDescription",
    "showTableQty",
    "showTablePrice",
    "showTableDiscount",
    "showTableTax",
    "showMessage",
    "showMemo",
    "showPaymentInfo",
    "showAmountInWords",
    "showSignature",
    "showFooter",
    "showFootnote",
]

PDF_CONTENT_TEXTS = [
    "labelCustomerRef",
    "labelTableQty",
    "labelTablePrice",
    "labelTableDiscount",
    "labelTableTax",
]


def _optional_fields(flags, texts, extra):
    fields = {name: serializers.BooleanField(required=False) for name in flags}
    fields.update(
        {
            name: serializers.CharField(required=False, allow_blank=True, max_length=100)
            for name in texts
        }
    )
    fields.update(extra)
    return fields


PdfHeaderSerializer = type(
    "PdfHeaderSerializer",
    (serializers.Serializer,),
    _optional_fields(
        PDF_HEADER_FLAGS,
        PDF_HEADER_TEXTS,
        {
            "logoPosition": serializers.ChoiceField(
                choices=["Left", "Center", "Right"], required=False
            ),
            "contentSize": serializers.ChoiceField(
                choices=["Large", "Medium", "Small"], required=False
            ),
        },
    ),
)

PdfContentSerializer = type(
    "PdfContentSerializer",
    (serializers.Serializer,),
    _optional_fields(
        PDF_CONTENT_FLAGS,
        PDF_CONTENT_TEXTS,
        {
            "dateFormat": serializers.ChoiceField(choices=PDF_DATE_FORMATS, required=False),
            "amountNominal": serializers.ChoiceField(
                choices=["Total", "Balance due"], required=False
            ),
            "footnoteText": serializers.CharField(
                required=False, allow_blank=True, max_length=200
            ),
        },
    ),
)


class PdfDocumentTemplateSerializer(serializers.Serializer):
    header = PdfHeaderSerializer(required=False)
    content = PdfContentSerializer(required=False)


class EmailTemplateSerializer(serializers.Serializer):
    subject = serializers.CharField(required=False, allow_blank=True, max_length=255)
    message = serializers.CharField(required=False, allow_blank=True, max_length=5000)


class WhatsappTemplateSerializer(serializers.Serializer):
    message = serializers.CharField(required=False, allow_blank=True, max_length=2000)
    show_footer = serializers.BooleanField(required=False)
    footer = serializers.CharField(required=False, allow_blank=True, max_length=500)


class SignatureRowSerializer(serializers.Serializer):
    option = serializers.ChoiceField(
        choices=["", "[User Name]", "[Company Name]"], required=False, allow_blank=True
    )
    text = serializers.CharField(required=False, allow_blank=True, max_length=150)


class PdfGeneralTemplateSerializer(serializers.Serializer):
    use_footer = serializers.BooleanField(required=False)
    use_signature = serializers.BooleanField(required=False)
    use_draft_watermark = serializers.BooleanField(required=False)
    use_qr_code = serializers.BooleanField(required=False)
    signature_types = serializers.ListField(
        child=serializers.ChoiceField(choices=SIGNATURE_DOCUMENT_TYPES),
        required=False,
        max_length=len(SIGNATURE_DOCUMENT_TYPES),
    )
    signature_rows = serializers.ListField(
        child=SignatureRowSerializer(), required=False, max_length=20
    )


class PdfCustomizeStateSerializer(serializers.Serializer):
    document_type = serializers.ChoiceField(
        choices=["Sales Invoice", "Sales Order", "Purchase Invoice"],
        required=False,
        allow_blank=True,
    )
    template = serializers.ChoiceField(
        choices=["Template 1", "Template 6", "Template 7", "Template 10", "Template 12"],
        required=False,
    )

    def validate(self, attrs):
        document_type = attrs.get("document_type")
        template = attrs.get("template")
        if (
            document_type
            and template == "Template 12"
            and document_type != "Sales Invoice"
        ):
            raise serializers.ValidationError(
                {"template": "Template 12 hanya tersedia untuk Sales Invoice."}
            )
        return attrs


class SignatureImageSerializer(serializers.Serializer):
    image = serializers.ImageField(required=False, allow_null=True)
    remove = serializers.BooleanField(required=False, default=False)

    def validate_image(self, value):
        if value and value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("Ukuran gambar tanda tangan maksimal 2 MB.")
        return value


TEMPLATE_SERIALIZERS = {
    "email_sales_invoice": EmailTemplateSerializer,
    "email_sales_quote": EmailTemplateSerializer,
    "email_sales_order": EmailTemplateSerializer,
    "email_purchase_order": EmailTemplateSerializer,
    "whatsapp_sales": WhatsappTemplateSerializer,
    "whatsapp_order": WhatsappTemplateSerializer,
    "pdf_general": PdfGeneralTemplateSerializer,
    "pdf_customize": PdfCustomizeStateSerializer,
    "pdf_sales_invoice": PdfDocumentTemplateSerializer,
    "pdf_sales_order": PdfDocumentTemplateSerializer,
    "pdf_purchase_invoice": PdfDocumentTemplateSerializer,
}


class SalesFormSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesFormSetting
        exclude = ["id", "company"]

class InvoiceReminderIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceReminderInterval
        fields = ["id", "days", "timing", "email_subject", "email_body", "include_pdf"]

    def validate_days(self, value):
        if value < 1:
            raise serializers.ValidationError("Minimal 1 hari.")
        return value

    def validate(self, attrs):
        current = self.instance
        reminder = InvoiceReminder.objects.filter(company=self.context["request"].user.company).first()
        if (
            current is None
            and InvoiceReminderInterval.objects.filter(reminder=reminder).count()
            >= 5
        ):
            raise serializers.ValidationError(
                f"Maksimal {5} interval pengingat."
            )
        days = attrs.get("days", current.days if current else None)
        timing = attrs.get("timing", current.timing if current else None)
        duplicates = InvoiceReminderInterval.objects.filter(
            reminder=reminder, days=days, timing=timing
        )
        if current:
            duplicates = duplicates.exclude(pk=current.pk)
        if duplicates.exists():
            raise serializers.ValidationError({"days": "Hari sudah digunakan."})
        return attrs

class InvoiceReminderSerializer(serializers.ModelSerializer):
    intervals = InvoiceReminderIntervalSerializer(many=True, read_only=True)
    exempt_customers = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Customer.objects.none(), required=False
    )

    class Meta:
        model = InvoiceReminder
        exclude = ["id", "company"]

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")
        if request is not None:
            fields["exempt_customers"].child_relation.queryset = Customer.objects.filter(
                Q(agent__company=request.user.company)
            )
        return fields

    def validate(self, attrs):
        current = self.instance
        by_amount = attrs.get("exempt_by_amount", current.exempt_by_amount if current else False)
        amount = attrs.get("exempt_amount_under", current.exempt_amount_under if current else None)
        if by_amount and amount is None:
            raise serializers.ValidationError(
                {"exempt_amount_under": "Isi nominal batas untuk menonaktifkan pengingat."}
            )
        return attrs


class ProductSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSetting
        exclude = ["id", "company"]

class ProductBatchReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBatchReminder
        fields = [
            "id",
            "title",
            "interval_value",
            "interval_unit",
            "timing",
            "email_subject",
            "email_body",
        ]


class PurchaseSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseSetting
        exclude = ["id", "company"]


class CompanyProductionSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProductionSetting
        fields = ["id", "production_plan_date_mode", "allow_backdated_plan_date", "allow_partial_production"]
        read_only_fields = ["id"]
