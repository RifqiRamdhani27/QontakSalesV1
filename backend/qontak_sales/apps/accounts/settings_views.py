import json

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import connection, transaction
from django.db.models import Max, Q
from django.http import HttpResponse
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from qontak_sales.apps.accounts_coa.models import AccountCOA
from qontak_sales.apps.customers.models import Customer

from .invitations import build_invitation_url, find_invitation, issue_invitation, send_invitation_email
from .billing_documents import render_billing_invoice
from .models import Company
from .permissions import IsManager, IsManagerOrReadOnly
from .settings_models import AccountMapping, ApprovalRule, Billing, CustomField, TaggingRule, TemplateSetting
from .settings_permissions import SETTINGS_MODULES, TEMPLATE_FEATURES, SettingsPermission, request_settings_access, validate_settings_assignment
from .settings_serializers import TEMPLATE_SERIALIZERS, AcceptInvitationSerializer, AccountMappingSerializer, ApprovalRuleSerializer, BillingSerializer, CustomFieldReorderSerializer, CustomFieldSerializer, InviteMemberSerializer, MemberSerializer, SignatureImageSerializer, TaggingRuleSerializer

User = get_user_model()

def company_members(company):
    if company is None:
        return User.objects.none()
    return (
        User.objects.filter(company=company)
        .exclude(status="inactive")
        .order_by("first_name", "last_name", "username")
    )

def user_option(user):
    return {
        "id": user.id,
        "username": user.username,
        "name": user.get_full_name().strip() or user.username,
        "email": user.email,
    }

class InvitationDetailView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        invitation = find_invitation(request.query_params.get("token", "").strip())
        if (
            invitation is None
            or not invitation.is_usable
            or invitation.user.status != "invited"
        ):
            return Response(
                {"detail": "Undangan tidak valid atau sudah kedaluwarsa."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = invitation.user
        return Response(
            {
                "email": user.email,
                "name": user.get_full_name().strip() or user.username,
                "company_name": user.company.name if user.company else "",
                "expires_at": invitation.expires_at,
            }
        )

class AcceptInvitationView(APIView):

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AcceptInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password berhasil dibuat. Silakan login."})

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "User management: User list"

    def get_queryset(self):
        return (
            User.objects.filter(company=self.request.user.company)
            .prefetch_related("roles")
            .order_by("username")
        )

    def create(self, request, *args, **kwargs):
        serializer = InviteMemberSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        validate_settings_assignment(request.user, d)
        if request.user.company_id is None:
            raise ValidationError({"detail": "Company pengguna tidak ditemukan."})
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=request.user.company_id)
            member = User.objects.create_user(
                username=d["username"],
                email=d.get("email", ""),
                password=None,
                company=request.user.company,
                role="AGENT",
                status="invited",
                type=d.get("type", "member"),
                access_time_limit=d.get("access_time_limit", ""),
                role_config=d.get("role_config", {}),
            )
            if d.get("roles"):
                member.roles.set(d["roles"])
            _invitation, token = issue_invitation(member, created_by=request.user)
        invitation_url = build_invitation_url(token)
        email_sent = send_invitation_email(member, invitation_url)

        data = dict(MemberSerializer(member).data)
        data["email_sent"] = email_sent
        if settings.DEBUG:
            data["invitation_url"] = invitation_url
        return Response(data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        if serializer.instance.role == "MANAGER" and self.request.user.role != "MANAGER":
            raise PermissionDenied("Owner tidak dapat diubah oleh akun lain.")
        validate_settings_assignment(self.request.user, serializer.validated_data, serializer.instance)
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        if member.role == "MANAGER" or member == request.user:
            return Response(
                {"detail": "Owner tidak dapat dihapus."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="resend-invitation")
    def resend_invitation(self, request, pk=None):
        member = self.get_object()
        if member.status != "invited":
            return Response(
                {"detail": "Hanya user berstatus invited yang bisa dikirim ulang."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not member.email:
            return Response(
                {"detail": "User ini tidak punya email."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        _invitation, token = issue_invitation(member, created_by=request.user)
        invitation_url = build_invitation_url(token)
        email_sent = send_invitation_email(member, invitation_url)
        payload = {
            "detail": "Undangan berhasil dikirim ulang.",
            "email_sent": email_sent,
        }
        if settings.DEBUG:
            payload["invitation_url"] = invitation_url
        return Response(payload)

    @action(detail=True, methods=["post"], url_path="transfer-ownership")
    def transfer_ownership(self, request, pk=None):
        new_owner = self.get_object()
        current = request.user
        if request.data.get("confirm") != "TRANSFER":
            return Response(
                {"detail": "Konfirmasi tidak valid."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if new_owner == current or new_owner.status != "active":
            return Response(
                {"detail": "Pemilik baru harus user aktif lain."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=current.company_id)
            current = User.objects.select_for_update().get(pk=current.pk)
            new_owner = User.objects.select_for_update().get(pk=new_owner.pk)
            if current.role != "MANAGER" or new_owner.company_id != current.company_id or new_owner.status != "active":
                raise ValidationError({"detail": "Kepemilikan telah berubah atau user tidak aktif."})
            new_owner.role = "MANAGER"
            new_owner.save(update_fields=["role"])
            current.role = "AGENT"
            current.save(update_fields=["role"])
        return Response({"detail": "Kepemilikan berhasil dialihkan."})

class CustomFieldViewSet(viewsets.ModelViewSet):
    settings_feature = "Custom fields"
    def create(self, request, *args, **kwargs):
        if request.user.company_id is None:
            raise ValidationError({"detail": "Company pengguna tidak ditemukan."})
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=request.user.company_id)
            return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=request.user.company_id)
            return super().update(request, *args, **kwargs)

    serializer_class = CustomFieldSerializer
    permission_classes = [SettingsPermission]

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return CustomField.objects.none()
        queryset = CustomField.objects.filter(company=company)
        params = self.request.query_params
        status_value = params.get("status")
        if status_value in dict(CustomField.STATUS_CHOICES):
            queryset = queryset.filter(status=status_value)
        for_page = params.get("for_page")
        if for_page:
            queryset = queryset.filter(page=for_page)
        for_sub_page = params.get("for_sub_page")
        if for_sub_page:
            if connection.vendor == "sqlite":
                queryset = queryset.filter(pk__in=[field.pk for field in queryset if for_sub_page in field.sub_pages])
            else:
                queryset = queryset.filter(sub_pages__contains=[for_sub_page])
        search = params.get("search", "").strip()
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def perform_create(self, serializer):
        company = self.request.user.company
        last_order = CustomField.objects.filter(company=company).aggregate(
            last=Max("sort_order")
        )["last"]
        serializer.save(company=company, sort_order=(last_order or 0) + 1)

    def destroy(self, request, *args, **kwargs):
        field = self.get_object()
        if field.status != "deleted":
            field.status = "deleted"
            field.save(update_fields=["status", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["get"])
    def quota(self, request):
        company = request.user.company
        used = (
            CustomField.objects.filter(company=company).exclude(status="deleted").count()
            if company
            else 0
        )
        return Response({"quota": CustomField.QUOTA, "used": used})

    @action(detail=False, methods=["post"])
    def reorder(self, request):
        serializer = CustomFieldReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]
        fields = {
            field.id: field
            for field in CustomField.objects.filter(
                company=request.user.company, id__in=ids
            ).exclude(status="deleted")
        }
        if len(fields) != len(ids):
            raise ValidationError({"ids": "Custom field tidak ditemukan."})
        positions = sorted(field.sort_order for field in fields.values())
        ordered = []
        for position, field_id in zip(positions, ids):
            field = fields[field_id]
            field.sort_order = position
            ordered.append(field)
        CustomField.objects.bulk_update(ordered, ["sort_order"])
        return Response(self.get_serializer(ordered, many=True).data)

class AccountMappingViewSet(viewsets.ModelViewSet):
    serializer_class = AccountMappingSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "Account Mapping"

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return AccountMapping.objects.none()
        return AccountMapping.objects.filter(company=company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=["get"])
    def options(self, request):
        company = request.user.company
        if company is None:
            return Response({"accounts": []})
        accounts = AccountCOA.objects.filter(company=company).order_by("kode_akun")
        return Response(
            {
                "accounts": [
                    {
                        "code": account.kode_akun,
                        "name": account.nama_akun,
                        "category": account.kategori_akun,
                        "label": (
                            f"({account.kode_akun}) - {account.nama_akun} "
                            f"({account.kategori_akun})"
                        ),
                    }
                    for account in accounts
                ]
            }
        )

    @action(detail=False, methods=["put"], url_path="bulk")
    def bulk(self, request):
        entries = request.data.get("mappings")
        if not isinstance(entries, list):
            raise ValidationError({"mappings": "Data mapping harus berupa list."})

        company = request.user.company
        if company is None:
            raise ValidationError({"detail": "Company pengguna tidak ditemukan."})

        serializer = AccountMappingSerializer(data=entries, many=True, context={"request": request, "bulk": True})
        serializer.is_valid(raise_exception=True)

        saved = []
        seen = set()
        with transaction.atomic():
            for item in serializer.validated_data:
                target_type = item.get("target_type") or "company"
                key = (item["account_type"], target_type, item["target_id"])
                if key in seen:
                    raise ValidationError(
                        {"mappings": "Target mapping tidak boleh duplikat."}
                    )
                seen.add(key)
                obj, _created = AccountMapping.objects.update_or_create(
                    company=company,
                    account_type=item["account_type"],
                    target_type=target_type,
                    target_id=item["target_id"],
                    defaults={
                        "account_code": item["account_code"],
                        "account_name": item["account_name"],
                        "is_active": item.get("is_active", True),
                        "mapping_options": item.get("mapping_options"),
                    },
                )
                saved.append(obj)
        return Response(AccountMappingSerializer(saved, many=True, context={"request": request}).data)

class BillingViewSet(viewsets.ModelViewSet):
    serializer_class = BillingSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "Billings"

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return Billing.objects.none()
        return Billing.objects.filter(customer=company)

    def perform_create(self, serializer):
        if self.request.user.company_id is None:
            raise ValidationError({"detail": "Company pengguna tidak ditemukan."})
        serializer.save(customer=self.request.user.company)

    @action(detail=False, methods=["get"])
    def overview(self, request):
        company = request.user.company
        if company is None:
            raise ValidationError({"detail": "Company pengguna tidak ditemukan."})
        members = User.objects.filter(company=company)
        invoices = self.get_queryset()
        next_invoice = invoices.filter(status__in=["sent", "overdue"]).order_by("due_date").first()
        latest_invoice = invoices.order_by("-invoice_date", "-pk").first()
        return Response({
            "subscription": None,
            "user_count": members.filter(type="member").count(),
            "partner_count": members.filter(type="partner").count(),
            "billing_period": latest_invoice.billing_period if latest_invoice else None,
            "next_due_date": next_invoice.due_date if next_invoice else None,
        })

    @action(detail=True, methods=["get"])
    def invoice(self, request, pk=None):
        invoice = self.get_object()
        response = HttpResponse(render_billing_invoice(invoice), content_type="text/html; charset=utf-8")
        response["Content-Disposition"] = f'attachment; filename="invoice-{invoice.pk}.html"'
        return response

class ApprovalRuleViewSet(viewsets.ModelViewSet):
    serializer_class = ApprovalRuleSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "Approval Rules"

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return ApprovalRule.objects.none()
        return ApprovalRule.objects.filter(company=company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=["get"])
    def options(self, request):
        company = request.user.company
        customers = (
            Customer.objects.filter(
                Q(agent__company=company)
            ).order_by("name")
            if company is not None
            else Customer.objects.none()
        )
        return Response(
            {
                "users": [user_option(user) for user in company_members(company)],
                "customers": [
                    {"id": customer.id, "name": customer.name}
                    for customer in customers
                ],
            }
        )

class TaggingRuleViewSet(viewsets.ModelViewSet):
    serializer_class = TaggingRuleSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "Tagging Rules"

    def get_queryset(self):
        company = self.request.user.company
        if company is None:
            return TaggingRule.objects.none()
        return TaggingRule.objects.filter(company=company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=["get"])
    def options(self, request):
        company = request.user.company
        return Response(
            {
                "users": [user_option(user) for user in company_members(company)],
            }
        )

class TemplateSettingView(APIView):
    permission_classes = [SettingsPermission]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_settings_features(self):
        key = self.kwargs.get("key")
        return (TEMPLATE_FEATURES.get(key),) if key is not None else SETTINGS_MODULES["template"]

    def _payload(self, setting, request):
        payload = dict(setting.data)
        if setting.key == "pdf_general":
            payload["signature_image_url"] = (
                request.build_absolute_uri(setting.signature_image.url)
                if setting.signature_image
                else None
            )
        return payload

    def _raw_data(self, request):
        if (request.content_type or "").startswith("multipart"):
            try:
                return json.loads(request.data.get("data", "{}"))
            except (TypeError, ValueError):
                raise ValidationError({"data": "Format data tidak valid."})
        return request.data

    def get(self, request, key=None):
        company = request.user.company
        queryset = (
            TemplateSetting.objects.filter(company=company)
            if company
            else TemplateSetting.objects.none()
        )
        if key is None:
            access = request_settings_access(request)
            return Response({
                item.key: self._payload(item, request) for item in queryset
                if access["is_owner"] or access["features"].get(TEMPLATE_FEATURES.get(item.key), {}).get("view", False)
            })
        if key not in TEMPLATE_SERIALIZERS:
            raise NotFound("Template tidak dikenal.")
        item = queryset.filter(key=key).first()
        return Response(self._payload(item, request) if item else {})

    def put(self, request, key):
        serializer_class = TEMPLATE_SERIALIZERS.get(key)
        if serializer_class is None:
            raise NotFound("Template tidak dikenal.")
        company = request.user.company
        if company is None:
            raise ValidationError({"detail": "User belum terhubung ke company."})

        serializer = serializer_class(data=self._raw_data(request))
        serializer.is_valid(raise_exception=True)

        image_serializer = SignatureImageSerializer(
            data={
                "image": request.FILES.get("signature_image"),
                "remove": request.data.get("remove_signature_image", False),
            }
        )
        image_serializer.is_valid(raise_exception=True)
        image = image_serializer.validated_data.get("image")
        remove_image = image_serializer.validated_data.get("remove")
        if key != "pdf_general" and (image or remove_image):
            raise ValidationError({"signature_image": "Gambar hanya untuk pdf_general."})

        with transaction.atomic():
            item, _created = TemplateSetting.objects.get_or_create(company=company, key=key)
            item.data = serializer.validated_data
            if (image or remove_image) and item.signature_image:
                item.signature_image.delete(save=False)
            if image:
                item.signature_image = image
            elif remove_image:
                item.signature_image = None
            item.save()
        return Response(self._payload(item, request))
