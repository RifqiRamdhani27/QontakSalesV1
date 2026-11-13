import importlib
import io
import secrets
import tempfile
from datetime import timedelta
from pathlib import Path

from django.apps import apps
from django.contrib.auth import get_user_model
from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TransactionTestCase, override_settings
from django.utils import timezone
from PIL import Image
from rest_framework.test import APIClient, APITestCase

from qontak_sales.apps.accounts_coa.models import AccountCOA
from qontak_sales.apps.customers.models import Customer
from qontak_sales.apps.products.models import ProductCategory, ProductUnit
from qontak_sales.apps.regions.models import City, Province

from .invitations import hash_token, issue_invitation
from .models import Company, ProductionSetting, Role
from .settings_permissions import SETTINGS_MODULES
from .settings_models import AccountMapping, ApprovalRule, Billing, CompanyProductionSetting, CustomField, Invitation, InvoiceReminder, InvoiceReminderInterval, ProductBatchReminder, ProductSetting, PurchaseSetting, SalesFormSetting, TaggingRule, TemplateSetting

User = get_user_model()


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend", DEBUG=True)
class SettingsIntegrationTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.password = secrets.token_urlsafe(24)
        cls.company = Company.objects.create(name="Integration company A", company_email="company-a@example.test")
        cls.other_company = Company.objects.create(name="Integration company B")
        cls.manager = User.objects.create_user(username="integration-manager", email="manager@example.test", password=cls.password, first_name="Integration", last_name="Manager", role="MANAGER", company=cls.company)
        cls.agent = User.objects.create_user(username="integration-agent", email="agent@example.test", password=cls.password, first_name="Integration", last_name="Agent", role="AGENT", company=cls.company)
        cls.other_manager = User.objects.create_user(username="other-manager", email="other-manager@example.test", password=cls.password, role="MANAGER", company=cls.other_company)
        cls.other_agent = User.objects.create_user(username="other-agent", email="other-agent@example.test", password=cls.password, role="AGENT", company=cls.other_company)
        cls.customer = Customer.objects.create(name="Integration customer A", agent=cls.agent)
        cls.other_customer = Customer.objects.create(name="Integration customer B", agent=cls.other_agent)
        cls.account = AccountCOA.objects.create(company=cls.company, kode_akun="10100", nama_akun="Integration cash A", kategori_akun="Cash & Bank")
        cls.other_account = AccountCOA.objects.create(company=cls.other_company, kode_akun="20100", nama_akun="Integration cash B", kategori_akun="Cash & Bank")
        cls.shared_role = Role.objects.create(code="integration-default", name="Legacy default role", is_default=True)
        cls.other_role = Role.objects.create(code="other-role", name="Other company role", company=cls.other_company)

    def setUp(self):
        self.client.force_authenticate(self.manager)

    def call(self, method, path, payload=None, expected=200, format="json", client=None):
        response = getattr(client or self.client, method)("/api/" + path, payload, format=format)
        self.assertEqual(response.status_code, expected, getattr(response, "data", response.content))
        return response

    def field_payload(self, name="Integration field", field_type="text", **extra):
        return {"name": name, "page": "sales", "sub_pages": ["Sales Invoice"], "field_type": field_type, **extra}

    def image(self, name="avatar.png", padding=0):
        content = io.BytesIO()
        Image.new("RGB", (12, 12), "blue").save(content, format="PNG")
        return SimpleUploadedFile(name, content.getvalue() + b"x" * padding, content_type="image/png")

    def test_login_and_refresh_keep_existing_contract(self):
        public = APIClient()
        token = self.call("post", "token/", {"email": self.manager.email, "password": self.password}, client=public)
        self.assertIn("access", token.data)
        refreshed = self.call("post", "token/refresh/", {"refresh": token.data["refresh"]}, client=public)
        self.assertIn("access", refreshed.data)
        public.credentials(HTTP_AUTHORIZATION="Bearer " + token.data["access"])
        profile = self.call("get", "settings/profile/", client=public)
        self.assertEqual(profile.data["role"], "MANAGER")
        self.assertNotIn("password", profile.data)

    def test_dashboard_and_agents_keep_existing_behavior(self):
        before = self.call("get", "dashboard/stats/").data
        agent = self.call("post", "agents/", {"username": "new-agent", "email": "new-agent@example.test", "password": self.password, "first_name": "New"}, expected=201)
        self.assertEqual(agent.data["role"], "AGENT")
        self.assertEqual(self.call("get", "dashboard/stats/").data["total_agents"], before["total_agents"] + 1)
        self.assertNotIn(self.other_agent.pk, [item["id"] for item in self.call("get", "agents/").data])
        agent_id = agent.data["id"]
        updated = self.call("patch", f"agents/{agent_id}/", {"first_name": "Updated", "last_name": "Agent", "phone": "00123", "role": "MANAGER", "company": self.other_company.pk})
        self.assertEqual(updated.data["first_name"], "Updated")
        self.assertEqual(updated.data["phone"], "00123")
        self.assertEqual(updated.data["role"], "AGENT")
        self.assertEqual(updated.data["company"], self.company.pk)
        self.call("get", f"agents/{self.other_agent.pk}/", expected=404)
        self.call("delete", f"agents/{self.other_agent.pk}/", expected=404)
        restricted = APIClient()
        restricted.force_authenticate(self.agent)
        self.call("get", "agents/", client=restricted, expected=403)
        self.call("delete", f"agents/{agent_id}/", expected=204)
        self.call("get", f"agents/{agent_id}/", expected=404)
        self.assertEqual(self.call("get", "dashboard/stats/").data, before)

    def test_company_save_is_scoped(self):
        self.call("put", "company/", {"name": "Updated integration company", "phone": "123", "province": "ACEH", "city": "KABUPATEN ACEH SELATAN", "postal_code": "12345"})
        self.company.refresh_from_db()
        self.other_company.refresh_from_db()
        self.assertEqual(self.company.name, "Updated integration company")
        self.assertEqual(self.other_company.name, "Integration company B")

    def test_profile_updates_only_allowed_fields(self):
        self.call("put", "settings/profile/", {"first_name": "Updated", "phone": "555", "role": "AGENT", "company": self.other_company.pk, "is_staff": True, "is_superuser": True})
        self.manager.refresh_from_db()
        self.assertEqual(self.manager.first_name, "Updated")
        self.assertEqual(self.manager.role, "MANAGER")
        self.assertEqual(self.manager.company_id, self.company.pk)
        self.assertFalse(self.manager.is_staff)
        self.assertFalse(self.manager.is_superuser)

    def test_profile_email_update_can_login_with_existing_authentication(self):
        self.call("put", "settings/profile/", {"email": "updated-login@example.test"})
        public = APIClient()
        response = public.post("/api/token/", {"email": "updated-login@example.test", "password": self.password}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        public.credentials(HTTP_AUTHORIZATION="Bearer " + response.data["access"])
        profile = public.get("/api/auth/profile/")
        self.assertEqual(profile.status_code, 200)
        self.assertEqual(profile.data["email"], "updated-login@example.test")

    def test_profile_duplicate_email_is_rejected_without_partial_update(self):
        self.call("put", "settings/profile/", {"email": self.other_manager.email.upper(), "first_name": "Must not persist"}, expected=400)
        self.manager.refresh_from_db()
        self.assertEqual(self.manager.first_name, "Integration")

    def test_profile_avatar_upload_and_removal(self):
        with tempfile.TemporaryDirectory(prefix="settings-avatar-") as directory, override_settings(MEDIA_ROOT=directory):
            response = self.call("put", "settings/profile/", {"avatar": self.image()}, format="multipart")
            self.assertIn("avatars/", response.data["avatar_url"])
            self.manager.refresh_from_db()
            saved = Path(self.manager.avatar.path)
            self.assertTrue(saved.exists())
            self.call("put", "settings/profile/", {"remove_avatar": "true"}, format="multipart")
            self.manager.refresh_from_db()
            self.assertFalse(self.manager.avatar)
            self.assertFalse(saved.exists())

    def test_profile_invalid_and_oversized_avatar(self):
        bad = SimpleUploadedFile("bad.png", b"not an image", content_type="image/png")
        self.call("put", "settings/profile/", {"avatar": bad}, expected=400, format="multipart")
        self.call("put", "settings/profile/", {"avatar": self.image(padding=5 * 1024 * 1024)}, expected=400, format="multipart")

    def test_all_singleton_gets_do_not_create_rows(self):
        models = [SalesFormSetting, PurchaseSetting, ProductSetting, CompanyProductionSetting, InvoiceReminder]
        before = [model.objects.count() for model in models]
        for path in ["sales/form-settings/", "purchases/form-settings/", "products/settings/", "settings/production-settings/", "sales/invoice-reminder/"]:
            with self.subTest(path=path):
                self.call("get", path)
        self.assertEqual(before, [model.objects.count() for model in models])

    def test_sales_form_settings_round_trip_and_isolation(self):
        payload = {"preferred_sales_term": "net_60", "use_sales_shipping": True, "default_sales_invoice_message": "Integration invoice message"}
        self.call("put", "sales/form-settings/", payload)
        self.assertTrue(self.call("get", "sales/form-settings/").data["use_sales_shipping"])
        self.client.force_authenticate(self.other_manager)
        self.assertFalse(self.call("get", "sales/form-settings/").data["use_sales_shipping"])
        self.assertEqual(SalesFormSetting.objects.count(), 1)

    def test_purchases_form_round_trip_and_validation(self):
        self.call("put", "purchases/form-settings/", {"use_purchase_discount": True, "preferred_purchase_term": "net_15", "default_purchase_order_message": "Integration order"})
        self.assertTrue(self.call("get", "purchases/form-settings/").data["use_purchase_discount"])
        self.call("put", "purchases/form-settings/", {"preferred_purchase_term": "invalid"}, expected=400)
        self.assertEqual(PurchaseSetting.objects.get(company=self.company).preferred_purchase_term, "net_15")

    def test_product_settings_and_existing_catalog_endpoints(self):
        self.call("put", "products/settings/", {"enable_barcode": True, "enable_serial_number_tracking": False})
        self.assertTrue(self.call("get", "products/settings/").data["enable_barcode"])
        self.call("post", "product-categories/", {"name": "Integration category"}, expected=201)
        self.call("post", "product-units/", {"name": "Integration unit"}, expected=201)
        self.assertTrue(ProductCategory.objects.filter(company=self.company, name="Integration category").exists())
        self.assertTrue(ProductUnit.objects.filter(company=self.company, name="Integration unit").exists())

    def test_production_settings_preserve_legacy_row(self):
        legacy = ProductionSetting.objects.create(production_plan_date_mode="optional", allow_partial_production=True)
        self.assertEqual(self.call("get", "settings/production-settings/").data["production_plan_date_mode"], "optional")
        self.call("put", "settings/production-settings/", {"production_plan_date_mode": "hidden", "allow_backdated_plan_date": True})
        legacy.refresh_from_db()
        self.assertEqual(legacy.production_plan_date_mode, "optional")
        self.assertTrue(legacy.allow_partial_production)
        self.client.force_authenticate(self.other_manager)
        self.assertEqual(self.call("get", "settings/production-settings/").data["production_plan_date_mode"], "optional")

    def test_bad_singleton_payload_does_not_create_default_row(self):
        self.call("put", "products/settings/", {"inventory_costing_method": "invalid"}, expected=400)
        self.assertFalse(ProductSetting.objects.exists())
        self.call("put", "settings/production-settings/", {"production_plan_date_mode": "invalid"}, expected=400)
        self.assertFalse(CompanyProductionSetting.objects.exists())

    def test_agent_with_view_grants_can_read_but_not_write_settings(self):
        features = [feature for module, names in SETTINGS_MODULES.items() if module not in ("company", "agents", "user-management") for feature in names]
        self.agent.role_config = {"authority": [f"Setting.{feature}.View" for feature in features]}
        self.agent.save(update_fields=["role_config"])
        self.client.force_authenticate(self.agent)
        for path in ["sales/form-settings/", "purchases/form-settings/", "products/settings/", "settings/production-settings/", "sales/invoice-reminder/", "template-settings/", "custom-fields/", "account-mappings/", "approval-rules/", "tagging-rules/", "billings/", "products/batch-reminders/"]:
            with self.subTest(path=path):
                self.call("get", path)
        for path in ["sales/form-settings/", "purchases/form-settings/", "products/settings/", "settings/production-settings/", "sales/invoice-reminder/", "products/batch-reminders/"]:
            with self.subTest(path=path):
                self.call("put", path, {}, expected=403)
        self.call("post", "custom-fields/", self.field_payload(), expected=403)
        self.call("get", "settings/members/", expected=403)

    def test_agent_without_settings_grants_cannot_read_settings(self):
        self.client.force_authenticate(self.agent)
        for path in ["sales/form-settings/", "purchases/form-settings/", "products/settings/", "settings/production-settings/", "sales/invoice-reminder/", "template-settings/", "custom-fields/", "account-mappings/", "approval-rules/", "tagging-rules/", "billings/", "products/batch-reminders/", "settings/members/"]:
            with self.subTest(path=path):
                self.call("get", path, expected=403)
        self.call("get", "settings/profile/")

    def test_unauthenticated_settings_access_is_denied(self):
        public = APIClient()
        for path in ["sales/form-settings/", "custom-fields/", "settings/profile/", "settings/members/", "settings/roles/"]:
            with self.subTest(path=path):
                self.call("get", path, expected=401, client=public)

    def test_companyless_user_cannot_create_settings(self):
        user = User.objects.create_user(username="companyless", role="MANAGER")
        self.client.force_authenticate(user)
        for path in ["sales/form-settings/", "purchases/form-settings/", "products/settings/", "settings/production-settings/", "sales/invoice-reminder/"]:
            self.call("put", path, {}, expected=403)
        self.call("post", "settings/members/", {"username": "companyless-invite", "email": "none@example.test"}, expected=403)

    def test_custom_fields_all_types_and_normalization(self):
        cases = [
            self.field_payload("Text", max_chars=20),
            self.field_payload("Number", "number", use_decimal=True, affix_type="prefix", affix_text="Rp"),
            self.field_payload("Date", "date", date_default="today"),
            self.field_payload("Dropdown", "dropdown", options=["First", "Second"], default_value="First", allow_multiple=True),
        ]
        previous = None
        for payload in cases:
            with self.subTest(type=payload["field_type"]):
                if previous is not None:
                    self.call("delete", f"custom-fields/{previous}/", expected=204)
                response = self.call("post", "custom-fields/", payload, expected=201)
                self.assertEqual(response.data["field_type"], payload["field_type"])
                previous = response.data["id"]
        response = self.call("patch", f"custom-fields/{response.data['id']}/", {"field_type": "text"})
        self.assertEqual(response.data["options"], [])
        self.assertFalse(response.data["allow_multiple"])

    def test_custom_field_validation(self):
        for payload in [self.field_payload(sub_pages=[]), self.field_payload(sub_pages=["Other app"]), self.field_payload(field_type="dropdown", options=["Same", "same"]), self.field_payload(field_type="dropdown", options=["First"], default_value="Missing"), self.field_payload(field_type="number", affix_type="prefix", affix_text=""), self.field_payload(max_chars=0)]:
            with self.subTest(payload=payload):
                self.call("post", "custom-fields/", payload, expected=400)
        self.assertFalse(CustomField.objects.exists())

    def test_custom_field_quota_soft_delete_and_reorder(self):
        ids = [self.call("post", "custom-fields/", self.field_payload(f"Field {index}"), expected=201).data["id"] for index in range(CustomField.QUOTA)]
        self.call("post", "custom-fields/", self.field_payload("Beyond quota"), expected=400)
        ordered = list(reversed(ids))
        self.assertEqual([x["id"] for x in self.call("post", "custom-fields/reorder/", {"ids": ordered}).data], ordered)
        self.call("delete", f"custom-fields/{ids[0]}/", expected=204)
        self.assertEqual(CustomField.objects.get(pk=ids[0]).status, "deleted")
        self.call("post", "custom-fields/", self.field_payload("After delete"), expected=201)
        quota = self.call("get", "custom-fields/quota/").data
        self.assertEqual(quota["used"], quota["quota"])

    def test_custom_field_cross_company_access_and_reorder_are_rejected(self):
        foreign = CustomField.objects.create(company=self.other_company, name="Foreign", page="products", field_type="text")
        self.call("get", f"custom-fields/{foreign.pk}/", expected=404)
        self.call("patch", f"custom-fields/{foreign.pk}/", {"name": "Not allowed"}, expected=404)
        self.call("post", "custom-fields/reorder/", {"ids": [foreign.pk]}, expected=400)
        foreign.refresh_from_db()
        self.assertEqual(foreign.name, "Foreign")

    def test_account_mapping_bulk_round_trip(self):
        entry = {"account_type": "sales", "target_type": "company", "target_id": "sales_account", "account_code": self.account.kode_akun, "account_name": "Must use catalog name"}
        self.call("put", "account-mappings/bulk/", {"mappings": [entry]})
        self.assertEqual(self.call("get", "account-mappings/").data[0]["account_name"], self.account.nama_akun)
        self.call("put", "account-mappings/bulk/", {"mappings": [entry]})
        self.assertEqual(AccountMapping.objects.count(), 1)
        self.assertEqual([item["code"] for item in self.call("get", "account-mappings/options/").data["accounts"]], [self.account.kode_akun])

    def test_mapping_bulk_duplicate_and_foreign_account_roll_back(self):
        base = {"account_type": "sales", "target_type": "company", "target_id": "sales_account", "account_code": self.account.kode_akun, "account_name": self.account.nama_akun}
        self.call("put", "account-mappings/bulk/", {"mappings": [base, base]}, expected=400)
        self.assertFalse(AccountMapping.objects.exists())
        self.call("put", "account-mappings/bulk/", {"mappings": [{**base, "account_code": self.other_account.kode_akun}]}, expected=400)
        self.assertFalse(AccountMapping.objects.exists())

    def test_approval_and_tagging_rule_crud_and_options(self):
        approval = self.call("post", "approval-rules/", {"name": "Integration approval", "rule_type": "workflow", "condition": {"createdByUsers": [self.agent.username], "createdForCustomers": [self.customer.name], "levels": [{"approvers": [self.manager.username]}]}}, expected=201)
        self.call("patch", f"approval-rules/{approval.data['id']}/", {"description": "Updated approval"})
        options = self.call("get", "approval-rules/options/").data
        self.assertEqual([x["name"] for x in options["customers"]], [self.customer.name])
        self.assertNotIn(self.other_agent.username, [x["username"] for x in options["users"]])
        tagging = self.call("post", "tagging-rules/", {"name": "Integration tagging", "tag_type": "transaction", "transaction_type": "Sales Invoice", "tag_set": ["Integration"], "tag_mapping": {"transactionMakers": [self.agent.username]}}, expected=201)
        self.call("patch", f"tagging-rules/{tagging.data['id']}/", {"name": "Updated tagging"})
        self.call("delete", f"tagging-rules/{tagging.data['id']}/", expected=204)
        self.call("delete", f"approval-rules/{approval.data['id']}/", expected=204)

    def test_rules_reject_foreign_company_relations_and_nested_names(self):
        payload = {"name": "Foreign approval", "rule_type": "workflow"}
        for extra in [{"approver_user": self.other_agent.pk}, {"approver_role": self.other_role.pk}, {"condition": {"createdByUsers": [self.other_agent.username]}}, {"condition": {"levels": [{"approvers": [self.other_agent.username]}]}}]:
            self.call("post", "approval-rules/", {**payload, **extra}, expected=400)
        self.call("post", "tagging-rules/", {"name": "Foreign tagging", "tag_type": "transaction", "transaction_type": "Sales Invoice", "tag_mapping": {"transactionMakers": [self.other_agent.username]}}, expected=400)
        self.assertFalse(ApprovalRule.objects.exists())
        self.assertFalse(TaggingRule.objects.exists())

    def test_cross_company_rule_and_billing_details_are_hidden(self):
        rule = ApprovalRule.objects.create(company=self.other_company, name="Foreign rule", rule_type="workflow")
        bill = Billing.objects.create(customer=self.other_company, invoice_number="FOREIGN-INV", invoice_date="2026-01-01", due_date="2026-01-31", amount=10, billing_period="monthly")
        self.call("get", f"approval-rules/{rule.pk}/", expected=404)
        self.call("delete", f"approval-rules/{rule.pk}/", expected=404)
        self.call("get", f"billings/{bill.pk}/", expected=404)
        self.assertEqual(self.call("get", "billings/").data, [])

    def test_billing_data_and_read_only_customer_are_company_scoped(self):
        bill = Billing.objects.create(customer=self.company, invoice_number="OWN-INV", invoice_date="2026-01-01", due_date="2026-01-31", amount=10, billing_period="monthly")
        self.call("patch", f"billings/{bill.pk}/", {"customer": self.other_company.pk, "notes": "Integration notes"})
        bill.refresh_from_db()
        self.assertEqual(bill.customer_id, self.company.pk)
        self.assertEqual(self.call("get", "billings/").data[0]["customer_name"], self.company.name)

    def test_billing_overview_invoice_export_and_totals(self):
        payload = {"invoice_number": "DOCUMENT-INV", "invoice_date": "2026-01-01", "due_date": "2026-01-31", "amount": "100.00", "tax_amount": "10.00", "total_amount": "1.00", "status": "paid", "billing_period": "monthly"}
        created = self.call("post", "billings/", payload, expected=201).data
        self.assertEqual(created["total_amount"], "110.00")
        self.assertIsNotNone(created["paid_at"])
        overview = self.call("get", "billings/overview/").data
        self.assertIsNone(overview["subscription"])
        self.assertEqual(overview["user_count"], 2)
        self.assertEqual(overview["partner_count"], 0)
        document = self.call("get", f"billings/{created['id']}/invoice/")
        self.assertEqual(document["Content-Type"], "text/html; charset=utf-8")
        self.assertIn("attachment", document["Content-Disposition"])
        self.assertIn(b"DOCUMENT-INV", document.content)
        self.assertIn(b"110.00", document.content)
        self.assertNotIn(self.other_company.name.encode(), document.content)
        self.call("patch", f"billings/{created['id']}/", {"status": "sent"})
        updated = self.call("get", f"billings/{created['id']}/").data
        self.assertIsNone(updated["paid_at"])

    def test_billing_documents_escape_content_and_reject_foreign_company(self):
        bill = Billing.objects.create(customer=self.company, invoice_number="SAFE-INV", invoice_date="2026-01-01", due_date="2026-01-31", amount=10, billing_period="monthly", notes="<script>alert('not executable')</script>")
        foreign = Billing.objects.create(customer=self.other_company, invoice_number="FOREIGN-DOC", invoice_date="2026-01-01", due_date="2026-01-31", amount=10, billing_period="monthly")
        document = self.call("get", f"billings/{bill.pk}/invoice/")
        self.assertNotIn(b"<script>", document.content)
        self.assertIn(b"&lt;script&gt;", document.content)
        self.call("get", f"billings/{foreign.pk}/invoice/", expected=404)
        self.call("patch", f"billings/{bill.pk}/", {"amount": "-1"}, expected=400)
        self.call("patch", f"billings/{bill.pk}/", {"tax_amount": "-1"}, expected=400)
        self.call("patch", f"billings/{bill.pk}/", {"due_date": "2025-12-31"}, expected=400)

    def test_all_template_keys_round_trip_and_unknown_keys_fail(self):
        from .settings_serializers import TEMPLATE_SERIALIZERS
        for key in TEMPLATE_SERIALIZERS:
            with self.subTest(key=key):
                self.call("get", f"template-settings/{key}/")
                self.call("put", f"template-settings/{key}/", {})
                self.assertTrue(TemplateSetting.objects.filter(company=self.company, key=key).exists())
        self.call("put", "template-settings/unknown/", {}, expected=404)
        self.assertEqual(TemplateSetting.objects.count(), len(TEMPLATE_SERIALIZERS))
        self.client.force_authenticate(self.other_manager)
        self.assertEqual(self.call("get", "template-settings/").data, {})

    def test_template_signature_image_upload_and_clear(self):
        with tempfile.TemporaryDirectory(prefix="settings-signature-") as directory, override_settings(MEDIA_ROOT=directory):
            result = self.call("put", "template-settings/pdf_general/", {"data": "{}", "signature_image": self.image("signature.png")}, format="multipart")
            self.assertIsNotNone(result.data["signature_image_url"])
            self.call("put", "template-settings/pdf_general/", {"data": "{}", "remove_signature_image": "true"}, format="multipart")
            item = TemplateSetting.objects.get(company=self.company, key="pdf_general")
            self.assertFalse(item.signature_image)
            self.assertIsNone(self.call("get", "template-settings/pdf_general/").data["signature_image_url"])

    def test_reminder_intervals_enforce_duplicates_quota_and_company(self):
        for index in range(5):
            self.call("post", "sales/invoice-reminder/intervals/", {"days": index + 1, "timing": "before_due", "email_subject": "Integration reminder", "email_body": "Integration body"}, expected=201)
        self.call("post", "sales/invoice-reminder/intervals/", {"days": 1, "timing": "before_due", "email_subject": "Integration reminder", "email_body": "Integration body"}, expected=400)
        self.call("post", "sales/invoice-reminder/intervals/", {"days": 9, "timing": "after_due", "email_subject": "Integration reminder", "email_body": "Integration body"}, expected=400)
        foreign = InvoiceReminder.objects.create(company=self.other_company)
        interval = InvoiceReminderInterval.objects.create(reminder=foreign, days=7, timing="before_due")
        self.call("delete", f"sales/invoice-reminder/intervals/{interval.pk}/", expected=404)
        self.assertEqual(len(self.call("get", "sales/invoice-reminder/").data["intervals"]), 5)

    def test_invoice_reminder_exemptions_validate_customer_ownership(self):
        self.call("put", "sales/invoice-reminder/", {"is_enabled": True, "exempt_customers": [self.customer.pk]})
        self.call("put", "sales/invoice-reminder/", {"exempt_customers": [self.other_customer.pk]}, expected=400)
        self.call("put", "sales/invoice-reminder/", {"exempt_by_amount": True, "exempt_amount_under": None}, expected=400)
        self.assertEqual(self.call("get", "sales/invoice-reminder/").data["exempt_customers"], [self.customer.pk])

    def test_batch_reminders_bulk_save_and_isolation(self):
        foreign = ProductBatchReminder.objects.create(company=self.other_company, title="Other company reminder")
        payload = [{"title": "Integration batch", "interval_value": 2, "interval_unit": "day", "timing": "before_expiration"}]
        self.call("put", "products/batch-reminders/", payload)
        self.call("put", "products/batch-reminders/", [{**payload[0], "interval_value": 0}], expected=400)
        self.assertTrue(ProductBatchReminder.objects.filter(pk=foreign.pk).exists())
        self.assertEqual(self.call("get", "products/batch-reminders/").data[0]["interval_value"], 2)

    def test_invitation_issue_email_accept_and_replay(self):
        response = self.call("post", "settings/members/", {"username": "invited-integration", "email": "invited@example.test", "roles": [self.shared_role.pk], "role_config": {"existing": ["sales"]}}, expected=201)
        user = User.objects.get(pk=response.data["id"])
        self.assertFalse(user.has_usable_password())
        self.assertEqual(user.role_config, {"existing": ["sales"]})
        self.assertEqual(len(mail.outbox), 1)
        invitation_url = response.data["invitation_url"]
        from urllib.parse import parse_qs, urlparse
        token = parse_qs(urlparse(invitation_url).query)["token"][0]
        self.assertEqual(user.invitation.token_hash, hash_token(token))
        public = APIClient()
        self.call("get", "auth/invitation/?token=" + token, client=public)
        data = {"token": token, "password": self.password, "password_confirm": self.password}
        self.call("post", "auth/accept-invitation/", data, client=public)
        user.refresh_from_db()
        self.assertEqual(user.status, "active")
        self.assertTrue(user.check_password(self.password))
        self.call("post", "auth/accept-invitation/", data, expected=400, client=public)

    def test_invitation_expiration_and_resend_invalidate_old_token(self):
        user = User.objects.create_user(username="expires-integration", email="expires@example.test", password=None, company=self.company, status="invited")
        invitation, first_token = issue_invitation(user, self.manager)
        invitation.expires_at = timezone.now() - timedelta(minutes=1)
        invitation.save()
        self.call("get", "auth/invitation/?token=" + first_token, expected=400, client=APIClient())
        self.call("post", f"settings/members/{user.pk}/resend-invitation/")
        self.call("get", "auth/invitation/?token=" + first_token, expected=400, client=APIClient())
        self.assertEqual(Invitation.objects.filter(user=user).count(), 1)

    def test_invitation_and_member_role_assignment_are_scoped(self):
        self.call("post", "settings/members/", {"username": "foreign-role-invite", "email": "foreign-role@example.test", "roles": [self.other_role.pk]}, expected=400)
        self.call("patch", f"settings/members/{self.agent.pk}/", {"roles": [self.other_role.pk]}, expected=400)
        self.call("patch", f"settings/members/{self.other_agent.pk}/", {"status": "inactive"}, expected=404)
        self.assertFalse(User.objects.filter(username="foreign-role-invite").exists())

    def test_member_updates_persist_role_config_and_deactivation(self):
        self.call("patch", f"settings/members/{self.agent.pk}/", {"roles": [self.shared_role.pk], "role_config": {"authority": ["sales_see"]}, "access_time_limit": "everyday", "status": "inactive"})
        self.agent.refresh_from_db()
        self.assertEqual(self.agent.role_config, {"authority": ["sales_see"]})
        self.assertFalse(self.agent.is_active)
        self.assertEqual(list(self.agent.roles.values_list("pk", flat=True)), [self.shared_role.pk])
        self.call("post", "token/", {"email": self.agent.email, "password": self.password}, expected=400, client=APIClient())

    def test_ownership_transfer_is_explicit_and_company_scoped(self):
        self.call("post", f"settings/members/{self.other_agent.pk}/transfer-ownership/", {"confirm": "TRANSFER"}, expected=404)
        self.call("post", f"settings/members/{self.agent.pk}/transfer-ownership/", {"confirm": "not-confirmed"}, expected=400)
        self.call("post", f"settings/members/{self.agent.pk}/transfer-ownership/", {"confirm": "TRANSFER"})
        self.manager.refresh_from_db()
        self.agent.refresh_from_db()
        self.assertEqual(self.manager.role, "AGENT")
        self.assertEqual(self.agent.role, "MANAGER")
        self.other_agent.refresh_from_db()
        self.assertEqual(self.other_agent.role, "AGENT")

    def test_owner_cannot_be_deleted_or_deactivated(self):
        self.call("delete", f"settings/members/{self.manager.pk}/", expected=400)
        self.call("patch", f"settings/members/{self.manager.pk}/", {"status": "inactive"}, expected=400)
        self.assertTrue(User.objects.filter(pk=self.manager.pk).exists())

    def test_custom_roles_create_edit_delete_without_altering_default_roles(self):
        authorities = [{"feature": "sales", "sub_feature": "invoices", "see": True, "edit": False}]
        response = self.call("post", "settings/roles/", {"code": "integration-custom", "name": "Integration custom role", "authorities": authorities}, expected=201)
        role = Role.objects.get(pk=response.data["id"])
        self.assertEqual(role.company_id, self.company.pk)
        self.call("patch", f"settings/roles/{role.pk}/", {"name": "Updated integration role", "authorities": [{**authorities[0], "edit": True}]})
        self.assertTrue(role.authorities.get().edit)
        self.call("delete", f"settings/roles/{role.pk}/", expected=204)
        self.call("patch", f"settings/roles/{self.shared_role.pk}/", {"name": "Not allowed"}, expected=400)
        self.shared_role.refresh_from_db()
        self.assertEqual(self.shared_role.name, "Legacy default role")

    def test_custom_role_isolation_and_duplicate_authorities(self):
        self.call("get", f"settings/roles/{self.other_role.pk}/", expected=404)
        item = {"feature": "sales", "sub_feature": "invoices", "see": True}
        self.call("post", "settings/roles/", {"code": "duplicate-authority", "name": "Duplicate authority", "authorities": [item, item]}, expected=400)
        self.client.force_authenticate(self.other_manager)
        self.call("post", "settings/roles/", {"code": "same-code", "name": "Company B same code"}, expected=201)
        self.client.force_authenticate(self.manager)
        self.call("post", "settings/roles/", {"code": "same-code", "name": "Company A same code"}, expected=201)

    def test_region_catalog_uses_existing_shipped_data(self):
        migration = importlib.import_module("qontak_sales.apps.regions.migrations.0002_settings_region_catalog")
        migration.seed_regions(apps, type("Editor", (), {"connection": connection})())
        response = self.call("get", "regions/provinces/")
        self.assertEqual({(row["code"], row["name"]) for row in response.data}, {(row["id"], row["name"]) for row in migration.PROVINCES})
        response = self.call("get", "regions/cities/?province_code=" + migration.PROVINCES[0]["id"])
        self.assertTrue(response.data)
        self.assertEqual(Province.objects.count(), len(migration.PROVINCES))
        self.assertEqual(City.objects.count(), len(migration.CITIES))


class SettingsMigrationPreservationTests(TransactionTestCase):
    def test_additive_migration_preserves_existing_rows_and_role_relations(self):
        executor = MigrationExecutor(connection)
        executor.migrate([("accounts", "0006_alter_customuser_access_time_limit")])
        state = executor.loader.project_state([("accounts", "0006_alter_customuser_access_time_limit")])
        HistoricalCompany = state.apps.get_model("accounts", "Company")
        HistoricalUser = state.apps.get_model("accounts", "CustomUser")
        HistoricalRole = state.apps.get_model("accounts", "Role")
        HistoricalProduction = state.apps.get_model("accounts", "ProductionSetting")
        company = HistoricalCompany.objects.create(name="Migration preservation company", bank_name="Preserved bank")
        role = HistoricalRole.objects.create(code="migration-preserved-role", name="Preserved role")
        user = HistoricalUser.objects.create(username="migration-preserved-user", email="preserved@example.test", password="isolated-fixture-hash", role="MANAGER", company_id=company.pk)
        user.roles.add(role)
        production = HistoricalProduction.objects.create(production_plan_date_mode="optional")
        fields = [field.name for field in HistoricalUser._meta.concrete_fields]
        before = HistoricalUser.objects.filter(pk=user.pk).values(*fields).get()
        try:
            executor = MigrationExecutor(connection)
            executor.migrate([("accounts", "0007_settings_profile_integration")])
            after = User.objects.filter(pk=user.pk).values(*fields).get()
            self.assertEqual(before, after)
            self.assertEqual(User.objects.get(pk=user.pk).role_config, {})
            self.assertEqual(list(User.objects.get(pk=user.pk).roles.values_list("pk", flat=True)), [role.pk])
            self.assertEqual(Company.objects.get(pk=company.pk).bank_name, "Preserved bank")
            self.assertEqual(ProductionSetting.objects.get(pk=production.pk).production_plan_date_mode, "optional")
            self.assertIsNone(Role.objects.get(pk=role.pk).company_id)
        finally:
            MigrationExecutor(connection).migrate([("accounts", "0007_settings_profile_integration")])
