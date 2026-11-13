import json
import os
import tempfile
from io import StringIO
from pathlib import Path
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError
from django.db.models.query import QuerySet
from django.test import TestCase
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

from .models import City, District, Province, Village
from .views import CityListView, PostalCodeListView, ProvinceListView


class RegionSeedTests(TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory(dir=os.environ.get("TMPDIR"))
        self.addCleanup(self.folder.cleanup)
        self.path = Path(self.folder.name) / "wilayah.json"
        self.data = {
            "provinces": [{"id": "99", "name": "Fixture province"}],
            "cities": [
                {"id": "99.01", "name": "Fixture city one", "provinceId": "99"},
                {"id": "99.02", "name": "Fixture city two", "provinceId": "99"},
            ],
            "districts": [
                {"id": "99.01.01", "name": "Fixture district one", "cityId": "99.01"},
                {"id": "99.02.01", "name": "Fixture district two", "cityId": "99.02"},
            ],
            "villages": [
                {"id": "99.01.01.0001", "name": "Fixture village one", "districtId": "99.01.01", "postalCode": "00101"},
                {"id": "99.01.01.0002", "name": "Fixture village two", "districtId": "99.01.01", "postalCode": "00101"},
                {"id": "99.01.01.0003", "name": "Fixture village three", "districtId": "99.01.01", "postalCode": ""},
                {"id": "99.02.01.0001", "name": "Fixture village four", "districtId": "99.02.01", "postalCode": "00102"},
            ],
        }
        self.write_data()

    def write_data(self):
        self.path.write_text(json.dumps(self.data), encoding="utf-8")

    def seed(self, **options):
        output = StringIO()
        call_command("seed_wilayah", data=str(self.path), stdout=output, **options)
        return output.getvalue()

    def test_seed_creates_related_rows_and_preserves_literal_postal_codes(self):
        self.seed()
        self.assertEqual(Province.objects.filter(code="99").count(), 1)
        self.assertEqual(City.objects.filter(province__code="99").count(), 2)
        self.assertEqual(District.objects.filter(city__province__code="99").count(), 2)
        self.assertEqual(Village.objects.filter(district__city__province__code="99").count(), 4)
        village = Village.objects.get(code="99.01.01.0001")
        self.assertEqual(village.postal_code, "00101")
        self.assertEqual(village.district.city.province.code, "99")

    def test_rerun_is_idempotent_fills_blanks_and_preserves_existing_values(self):
        self.seed()
        original_ids = dict(Village.objects.filter(code__startswith="99.").values_list("code", "id"))
        village = Village.objects.get(code="99.01.01.0001")
        village.name = "Existing fixture name"
        village.postal_code = "99999"
        village.save(update_fields=["name", "postal_code"])
        self.data["villages"][2]["postalCode"] = "00103"
        self.write_data()
        self.seed()
        self.assertEqual(original_ids, dict(Village.objects.filter(code__startswith="99.").values_list("code", "id")))
        village.refresh_from_db()
        self.assertEqual(village.name, "Existing fixture name")
        self.assertEqual(village.postal_code, "99999")
        self.assertEqual(Village.objects.get(code="99.01.01.0003").postal_code, "00103")

    def test_dry_run_validates_without_writing(self):
        self.seed(dry_run=True)
        self.assertFalse(Province.objects.filter(code="99").exists())
        self.assertFalse(Village.objects.filter(code__startswith="99.").exists())

    def test_invalid_postal_token_is_rejected_without_normalizing(self):
        self.data["villages"][0]["postalCode"] = "00101 "
        self.write_data()
        with self.assertRaises(CommandError):
            self.seed()
        self.assertFalse(Province.objects.filter(code="99").exists())

    def test_orphaned_source_relation_is_rejected_before_writes(self):
        self.data["villages"][0]["districtId"] = "99.03.01"
        self.write_data()
        with self.assertRaises(CommandError):
            self.seed()
        self.assertFalse(Province.objects.filter(code="99").exists())

    def test_duplicate_source_identifiers_are_rejected(self):
        self.data["villages"].append(dict(self.data["villages"][0]))
        self.write_data()
        with self.assertRaises(CommandError):
            self.seed()
        self.assertFalse(Province.objects.filter(code="99").exists())

    def test_existing_parent_conflict_is_not_overwritten(self):
        other = Province.objects.create(code="98", name="Existing fixture province")
        city = City.objects.create(code="99.01", name="Existing fixture city", province=other)
        with self.assertRaises(CommandError):
            self.seed()
        city.refresh_from_db()
        self.assertEqual(city.province_id, other.id)
        self.assertFalse(Province.objects.filter(code="99").exists())

    def test_database_failure_rolls_back_all_new_rows(self):
        original = QuerySet.bulk_create

        def fail_villages(queryset, *args, **kwargs):
            if queryset.model is Village:
                raise RuntimeError("Injected fixture failure")
            return original(queryset, *args, **kwargs)

        with patch.object(QuerySet, "bulk_create", fail_villages):
            with self.assertRaises(RuntimeError):
                self.seed()
        self.assertFalse(Province.objects.filter(code="99").exists())
        self.assertFalse(District.objects.filter(code__startswith="99.").exists())

    def test_postal_override_fills_missing_values(self):
        path = Path(self.folder.name) / "kodepos.json"
        path.write_text(json.dumps({"99.01.01.0003": "00103"}), encoding="utf-8")
        self.seed(kodepos=str(path))
        self.assertEqual(Village.objects.get(code="99.01.01.0003").postal_code, "00103")

    def test_bundled_dataset_is_available_without_other_project_folders(self):
        output = StringIO()
        call_command("seed_wilayah", dry_run=True, stdout=output)
        self.assertIn("Dry run", output.getvalue())

    def test_postal_endpoint_filters_deduplicates_sorts_and_keeps_strings(self):
        self.seed()
        request = APIRequestFactory().get("/api/postal-codes/", {"city_code": "99.01"})
        force_authenticate(request, user=get_user_model()())
        response = PostalCodeListView.as_view()(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{"id": 0, "code": "00101"}])

    def test_postal_endpoint_missing_or_unknown_city_returns_empty_list(self):
        for parameters in [{}, {"city_code": "99.99"}]:
            with self.subTest(parameters=parameters):
                request = APIRequestFactory().get("/api/postal-codes/", parameters)
                force_authenticate(request, user=get_user_model()())
                response = PostalCodeListView.as_view()(request)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.data, [])

    def test_region_endpoints_preserve_existing_response_contracts(self):
        self.seed()
        factory = APIRequestFactory()
        request = factory.get("/api/provinces/")
        force_authenticate(request, user=get_user_model()())
        response = ProvinceListView.as_view()(request)
        province = next(row for row in response.data if row["code"] == "99")
        self.assertIsInstance(province["id"], int)
        request = factory.get("/api/cities/", {"province_code": "99"})
        force_authenticate(request, user=get_user_model()())
        response = CityListView.as_view()(request)
        self.assertEqual([row["code"] for row in response.data], ["99.01", "99.02"])
        self.assertTrue(all(row["province"] == province["id"] for row in response.data))

    def test_region_endpoints_still_require_authentication(self):
        response = PostalCodeListView.as_view()(APIRequestFactory().get("/api/postal-codes/", {"city_code": "99.01"}))
        self.assertIn(response.status_code, [401, 403])

    def test_registered_region_urls_return_database_data(self):
        self.seed()
        client = APIClient()
        client.force_authenticate(user=get_user_model()())
        response = client.get("/api/regions/cities/", {"province_code": "99"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["code"] for row in response.data], ["99.01", "99.02"])
        response = client.get("/api/regions/postal-codes/", {"city_code": "99.01"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{"id": 0, "code": "00101"}])
