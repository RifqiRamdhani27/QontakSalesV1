from django.contrib.auth import get_user_model
from django.urls import resolve
from rest_framework.test import APITestCase

from .models import Company, ProductionSetting, Role
from .settings_access_views import LegacyRoleViewSet, SettingsProfileView
from .settings_endpoints import CompanyProductionSettingView, CompanyRoleViewSet
from .settings_models import CompanyProductionSetting
from .settings_views import MemberViewSet as SettingsMemberViewSet
from .views import AgentViewSet, CompanyDetailView, MemberViewSet, ProductionSettingDetailView, ProfileView


class SettingsLegacyContractTests(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Legacy contract fixture")
        self.other_company = Company.objects.create(name="Other contract fixture")
        self.user = get_user_model().objects.create_user(
            username="legacy-contract-fixture",
            email="legacy-contract@example.test",
            role="MANAGER",
            company=self.company,
        )
        self.client.force_authenticate(self.user)

    def test_existing_and_settings_routes_use_separate_handlers(self):
        expected = {
            "/api/agents/": AgentViewSet,
            "/api/company/": CompanyDetailView,
            "/api/auth/profile/": ProfileView,
            "/api/members/": MemberViewSet,
            "/api/roles/": LegacyRoleViewSet,
            "/api/production-settings/": ProductionSettingDetailView,
            "/api/settings/profile/": SettingsProfileView,
            "/api/settings/roles/": CompanyRoleViewSet,
            "/api/settings/members/": SettingsMemberViewSet,
            "/api/settings/production-settings/": CompanyProductionSettingView,
        }
        for url, view in expected.items():
            with self.subTest(url=url):
                self.assertIs(resolve(url).func.cls, view)

    def test_legacy_roles_keep_global_records_without_leaking_new_company_roles(self):
        legacy = Role.objects.create(code="legacy-contract-role", name="Legacy contract role")
        own = Role.objects.create(code="own-contract-role", name="Own contract role", company=self.company)
        other = Role.objects.create(code="other-contract-role", name="Other contract role", company=self.other_company)
        old_response = self.client.get("/api/roles/")
        self.assertEqual(old_response.status_code, 200)
        old_rows = old_response.data.get("results", []) if isinstance(old_response.data, dict) else old_response.data
        old_ids = {row["id"] for row in old_rows}
        self.assertIn(legacy.pk, old_ids)
        self.assertNotIn(own.pk, old_ids)
        self.assertNotIn(other.pk, old_ids)
        new_response = self.client.get("/api/settings/roles/")
        self.assertEqual(new_response.status_code, 200)
        new_rows = new_response.data.get("results", []) if isinstance(new_response.data, dict) else new_response.data
        new_ids = {row["id"] for row in new_rows}
        self.assertIn(legacy.pk, new_ids)
        self.assertIn(own.pk, new_ids)
        self.assertNotIn(other.pk, new_ids)
        self.assertEqual(self.client.get(f"/api/roles/{own.pk}/").status_code, 404)

    def test_company_production_overrides_do_not_change_legacy_defaults(self):
        legacy = ProductionSetting.objects.create(pk=1, allow_partial_production=False)
        CompanyProductionSetting.objects.create(company=self.company, allow_partial_production=True)
        old_response = self.client.get("/api/production-settings/")
        new_response = self.client.get("/api/settings/production-settings/")
        self.assertEqual(old_response.status_code, 200)
        self.assertEqual(new_response.status_code, 200)
        self.assertFalse(old_response.data["allow_partial_production"])
        self.assertTrue(new_response.data["allow_partial_production"])
        legacy.refresh_from_db()
        self.assertFalse(legacy.allow_partial_production)

    def test_profile_read_contract_is_shared_without_replacing_legacy_handler(self):
        old_response = self.client.get("/api/auth/profile/")
        new_response = self.client.get("/api/settings/profile/")
        self.assertEqual(old_response.status_code, 200)
        self.assertEqual(new_response.status_code, 200)
        self.assertEqual(old_response.data, new_response.data)
