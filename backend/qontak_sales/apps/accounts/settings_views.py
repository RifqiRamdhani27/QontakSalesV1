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









