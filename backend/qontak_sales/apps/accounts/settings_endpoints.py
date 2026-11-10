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


class SalesFormSettingView(CompanySettingView):
    settings_feature = "Sales: Form settings"
    model = SalesFormSetting
    serializer_class = SalesFormSettingSerializer


class PurchaseSettingView(CompanySettingView):
    settings_feature = "Purchase"
    model = PurchaseSetting
    serializer_class = PurchaseSettingSerializer


class ProductSettingView(CompanySettingView):
    settings_feature = "Product: Good & Services"
    model = ProductSetting
    serializer_class = ProductSettingSerializer

    def get_settings_features(self):
        return ("Product: Good & Services", "Product: Warehouse")

    def _allowed_response(self, request, response):
        features = request_settings_access(request)["features"]
        if not features["Product: Good & Services"]["view"]:
            response.data = {key: value for key, value in response.data.items() if key == "enable_storage_location"}
        if not features["Product: Warehouse"]["view"]:
            response.data.pop("enable_storage_location", None)
        return response

    def get(self, request):
        return self._allowed_response(request, super().get(request))

    def put(self, request):
        features = request_settings_access(request)["features"]
        if "enable_storage_location" in request.data and not features["Product: Warehouse"]["edit"]:
            raise PermissionDenied("Tidak memiliki izin mengubah pengaturan gudang.")
        if any(key != "enable_storage_location" for key in request.data) and not features["Product: Good & Services"]["edit"]:
            raise PermissionDenied("Tidak memiliki izin mengubah pengaturan produk.")
        return self._allowed_response(request, super().put(request))


class CompanyProductionSettingView(CompanySettingView):
    settings_feature = "Production"
    model = CompanyProductionSetting
    serializer_class = CompanyProductionSettingSerializer

    def legacy_defaults(self):
        legacy = ProductionSetting.objects.order_by("pk").first()
        if legacy is None:
            return {}
        return {
            "production_plan_date_mode": legacy.production_plan_date_mode,
            "allow_backdated_plan_date": legacy.allow_backdated_plan_date,
            "allow_partial_production": legacy.allow_partial_production,
        }

    def get(self, request):
        company = settings_company(request)
        item = self.model.objects.filter(company=company).first()
        if item is None:
            item = self.model(company=company, **self.legacy_defaults())
        return Response(self.serializer_class(item).data)

    def put(self, request):
        company = settings_company(request)
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=company.pk)
            item, _created = self.model.objects.get_or_create(company=company, defaults=self.legacy_defaults())
            serializer = self.serializer_class(item, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(serializer.data)


class InvoiceReminderView(CompanySettingView):
    settings_feature = "Sales: Invoice reminder"
    model = InvoiceReminder
    serializer_class = InvoiceReminderSerializer

    def get(self, request):
        company = settings_company(request)
        item = self.model.objects.filter(company=company).first()
        if item is not None:
            return Response(self.serializer_class(item, context={"request": request}).data)
        serializer = self.serializer_class(self.model(company=company), context={"request": request})
        serializer.fields.pop("intervals")
        serializer.fields.pop("exempt_customers")
        return Response({**serializer.data, "intervals": [], "exempt_customers": []})


class InvoiceReminderIntervalViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceReminderIntervalSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "Sales: Invoice reminder"

    def get_queryset(self):
        return InvoiceReminderInterval.objects.filter(reminder__company=self.request.user.company)

    def create(self, request, *args, **kwargs):
        company = settings_company(request)
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=company.pk)
            reminder, _created = InvoiceReminder.objects.get_or_create(company=company)
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(reminder=reminder)
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=settings_company(request).pk)
            return super().update(request, *args, **kwargs)


class ProductBatchReminderListView(APIView):
    permission_classes = [SettingsPermission]
    settings_feature = "Product: Good & Services"

    def get(self, request):
        items = ProductBatchReminder.objects.filter(company=settings_company(request))
        return Response(ProductBatchReminderSerializer(items, many=True).data)

    def put(self, request):
        company = settings_company(request)
        if not isinstance(request.data, list):
            raise ValidationError({"detail": "Reminder harus berupa list."})
        serializer = ProductBatchReminderSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            Company.objects.select_for_update().get(pk=company.pk)
            ProductBatchReminder.objects.filter(company=company).delete()
            items = ProductBatchReminder.objects.bulk_create([ProductBatchReminder(company=company, **item) for item in serializer.validated_data])
        return Response(ProductBatchReminderSerializer(items, many=True).data)


class CompanyRoleSerializer(serializers.ModelSerializer):
    authorities = RoleAuthoritySerializer(many=True, required=False)

    class Meta:
        model = Role
        fields = ["id", "code", "name", "description", "is_default", "authorities"]
        read_only_fields = ["id", "is_default"]

    def to_internal_value(self, data):
        data = data.copy()
        if self.instance is None and data.get("code"):
            data["code"] = f"company_{settings_company(self.context['request']).pk}_{data['code']}"
        return super().to_internal_value(data)

    def validate_authorities(self, value):
        keys = [(item["feature"], item["sub_feature"]) for item in value]
        if len(set(keys)) != len(keys):
            raise serializers.ValidationError("Authority tidak boleh duplikat.")
        validate_settings_authorities(self.context["request"].user, value)
        return value

    def create(self, validated_data):
        authorities = validated_data.pop("authorities", [])
        with transaction.atomic():
            role = Role.objects.create(**validated_data)
            RoleAuthority.objects.bulk_create([RoleAuthority(role=role, **item) for item in authorities])
        return role

    def update(self, instance, validated_data):
        if instance.company_id != settings_company(self.context["request"]).pk or instance.is_default:
            raise serializers.ValidationError("Role bawaan atau role global tidak dapat diubah.")
        authorities = validated_data.pop("authorities", None)
        validated_data.pop("code", None)
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            if authorities is not None:
                instance.authorities.all().delete()
                RoleAuthority.objects.bulk_create([RoleAuthority(role=instance, **item) for item in authorities])
        return instance


class CompanyRoleViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyRoleSerializer
    permission_classes = [SettingsPermission]
    settings_feature = "User management: Custom role"
    settings_role_choices = True

    def get_queryset(self):
        company = settings_company(self.request)
        return Role.objects.filter(Q(company=company) | Q(company__isnull=True)).prefetch_related("authorities").order_by("name")

    def perform_create(self, serializer):
        serializer.save(company=settings_company(self.request), is_default=False)

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.company_id != settings_company(request).pk or role.is_default:
            raise ValidationError({"detail": "Role bawaan atau role global tidak dapat dihapus."})
        if role.users.exists() or role.approval_rules.exists():
            raise ValidationError({"detail": "Role masih digunakan."})
        return super().destroy(request, *args, **kwargs)
