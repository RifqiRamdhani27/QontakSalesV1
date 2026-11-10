from rest_framework import permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .settings_permissions import SettingsPermission, get_settings_access
from .views import AgentViewSet, CompanyDetailView


class SettingsAccessView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(get_settings_access(request.user))


class SettingsCompanyView(CompanyDetailView):
    permission_classes = [SettingsPermission]
    settings_feature = "Company setting"


class SettingsAgentViewSet(AgentViewSet):
    permission_classes = [SettingsPermission]
    settings_feature = "Agents"

    def destroy(self, request, *args, **kwargs):
        if self.get_object().pk == request.user.pk:
            raise ValidationError({"detail": "Tidak dapat menghapus akun sendiri."})
        return super().destroy(request, *args, **kwargs)
