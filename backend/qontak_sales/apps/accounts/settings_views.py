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






