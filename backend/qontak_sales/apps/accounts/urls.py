from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CompanyDetailView,
    DashboardStatsView,
    EmailTokenObtainPairView,
    ProfileView,
    AgentViewSet,
    ProductionSettingDetailView,
    RegisterView,
)
from qontak_sales.apps.customers.views import CustomerViewSet
from .settings_endpoints import CompanyRoleViewSet, InvoiceReminderIntervalViewSet, InvoiceReminderView, SalesFormSettingView
from .settings_access_views import SettingsAccessView, SettingsAgentViewSet, SettingsCompanyView
from .settings_views import AcceptInvitationView, InvitationDetailView, MemberViewSet as SettingsMemberViewSet

router = DefaultRouter()
router.register(r"agents", AgentViewSet, basename="agent")
router.register(r"settings/agents", SettingsAgentViewSet, basename="settings-agent")
router.register(r"members", SettingsMemberViewSet, basename="member")
router.register(r"roles", CompanyRoleViewSet, basename="role")
router.register(r"customers", CustomerViewSet, basename="customer")
router.register(r"sales/invoice-reminder/intervals", InvoiceReminderIntervalViewSet, basename="invoice-reminder-interval")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/profile/", ProfileView.as_view(), name="profile"),
    path("company/", CompanyDetailView.as_view(), name="company-detail"),
    path("settings/access/", SettingsAccessView.as_view(), name="settings-access"),
    path("settings/company/", SettingsCompanyView.as_view(), name="settings-company"),
    path("production-settings/", ProductionSettingDetailView.as_view(), name="production-setting-detail"),
    path("sales/form-settings/", SalesFormSettingView.as_view(), name="sales-form-settings"),
    path("sales/invoice-reminder/", InvoiceReminderView.as_view(), name="invoice-reminder"),
    path("auth/invitation/", InvitationDetailView.as_view(), name="invitation-detail"),
    path("auth/accept-invitation/", AcceptInvitationView.as_view(), name="accept-invitation"),
    path("dashboard/stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("", include(router.urls)),
]
