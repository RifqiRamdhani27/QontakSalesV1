from django.db import transaction
from django.db.models import Q
from rest_framework import serializers, viewsets
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Company, ProductionSetting, Role, RoleAuthority
from .permissions import IsManager, IsManagerOrReadOnly
from .serializers import RoleAuthoritySerializer
from .settings_permissions import SettingsPermission, request_settings_access, validate_settings_authorities
from .settings_models import CompanyProductionSetting, InvoiceReminder, InvoiceReminderInterval, ProductBatchReminder, ProductSetting, PurchaseSetting, SalesFormSetting
from .settings_serializers import CompanyProductionSettingSerializer, InvoiceReminderIntervalSerializer, InvoiceReminderSerializer, ProductBatchReminderSerializer, ProductSettingSerializer, PurchaseSettingSerializer, SalesFormSettingSerializer


def settings_company(request):
    company = request.user.company
    if company is None:
        raise ValidationError({"detail": "User belum terhubung ke company."})
    return company


class CompanySettingView(APIView):
    permission_classes = [SettingsPermission]

    def get(self, request):
        company = settings_company(request)
        item = self.model.objects.filter(company=company).first()
        if item is None:
            item = self.model(company=company)
        return Response(self.serializer_class(item, context={"request": request}).data)

    def put(self, request):
        company = settings_company(request)
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=company.pk)
            item, _created = self.model.objects.get_or_create(company=company)
            serializer = self.serializer_class(item, data=request.data, partial=True, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(serializer.data)


















