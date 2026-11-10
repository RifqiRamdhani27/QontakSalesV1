import json
import re
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import connections, transaction

from qontak_sales.apps.regions.models import City, District, Province, Village


class Command(BaseCommand):
    help = "Isi tabel wilayah dan kode pos dari dataset yang disertakan dalam repository."

    def add_arguments(self, parser):
        parser.add_argument("--data", default=str(Path(__file__).resolve().parents[2] / "data" / "wilayah.json"))
        parser.add_argument("--kodepos", default="", help="JSON tambahan: kode kelurahan -> kode pos; nilai database yang sudah terisi tetap dipertahankan.")
        parser.add_argument("--database", default="default", choices=list(connections))
        parser.add_argument("--dry-run", action="store_true", help="Validasi sumber dan tampilkan rencana tanpa mengubah database.")

    def read_json(self, path):
        try:
            return json.loads(Path(path).read_text(encoding="utf-8"))
        except (OSError, ValueError) as error:
            raise CommandError(f"Tidak dapat membaca dataset {path}: {error}") from error

    def validate_rows(self, rows, label, pattern):
        if not isinstance(rows, list) or not rows:
            raise CommandError(f"Dataset {label} harus berupa daftar yang tidak kosong.")
        codes = set()
        for row in rows:
            if not isinstance(row, dict):
                raise CommandError(f"Baris {label} bukan object JSON.")
            code = row.get("id")
            name = row.get("name")
            if not isinstance(code, str) or not re.fullmatch(pattern, code):
                raise CommandError(f"Kode {label} tidak valid: {code!r}")
            if code in codes:
                raise CommandError(f"Kode {label} duplikat: {code}")
            if not isinstance(name, str) or not name.strip() or len(name) > 100:
                raise CommandError(f"Nama {label} tidak valid: {code}")
            codes.add(code)
        return codes

    def handle(self, *args, **options):
        data = self.read_json(options["data"])
        if not isinstance(data, dict) or not all(key in data for key in ["provinces", "cities", "districts", "villages"]):
            raise CommandError("Dataset harus memuat provinces, cities, districts, dan villages.")
        province_codes = self.validate_rows(data["provinces"], "provinsi", r"\d{2}")
        city_codes = self.validate_rows(data["cities"], "kota", r"\d{2}\.\d{2}")
        district_codes = self.validate_rows(data["districts"], "kecamatan", r"\d{2}\.\d{2}\.\d{2}")
        village_codes = self.validate_rows(data["villages"], "kelurahan", r"\d{2}\.\d{2}\.\d{2}\.\d{4}")

        for row in data["cities"]:
            if row.get("provinceId") not in province_codes or row["provinceId"] != row["id"][:2]:
                raise CommandError(f"Relasi provinsi untuk kota tidak valid: {row['id']}")
        for row in data["districts"]:
            if row.get("cityId") not in city_codes or row["cityId"] != row["id"][:5]:
                raise CommandError(f"Relasi kota untuk kecamatan tidak valid: {row['id']}")
        for row in data["villages"]:
            if row.get("districtId") not in district_codes or row["districtId"] != row["id"][:8]:
                raise CommandError(f"Relasi kecamatan untuk kelurahan tidak valid: {row['id']}")
            postal = row.get("postalCode", "")
            if not isinstance(postal, str) or (postal and not re.fullmatch(r"\d{5}", postal)):
                raise CommandError(f"Kode pos tidak valid: {row['id']} -> {postal!r}")

        if options["kodepos"]:
            postal_codes = self.read_json(options["kodepos"])
            if not isinstance(postal_codes, dict):
                raise CommandError("File kode pos tambahan harus berupa object JSON.")
            for code, postal in postal_codes.items():
                if code not in village_codes or not isinstance(postal, str) or not re.fullmatch(r"\d{5}", postal):
                    raise CommandError(f"Mapping kode pos tambahan tidak valid: {code!r} -> {postal!r}")
            for row in data["villages"]:
                if row["id"] in postal_codes:
                    row["postalCode"] = postal_codes[row["id"]]

        alias = options["database"]
        self.stdout.write(f"Database: {connections[alias].settings_dict['NAME']}")
        self.stdout.write(f"Dataset: {options['data']}")
        with transaction.atomic(using=alias):
            existing_provinces = set(Province.objects.using(alias).values_list("code", flat=True))
            existing_cities = {row["code"]: row for row in City.objects.using(alias).values("code", "province__code")}
            existing_districts = {row["code"]: row for row in District.objects.using(alias).values("code", "city__code")}
            existing_villages = {row["code"]: row for row in Village.objects.using(alias).values("id", "code", "district__code", "postal_code")}
            for row in data["cities"]:
                existing = existing_cities.get(row["id"])
                if existing and existing["province__code"] != row["provinceId"]:
                    raise CommandError(f"Relasi kota existing berbeda; tidak ditimpa: {row['id']}")
            for row in data["districts"]:
                existing = existing_districts.get(row["id"])
                if existing and existing["city__code"] != row["cityId"]:
                    raise CommandError(f"Relasi kecamatan existing berbeda; tidak ditimpa: {row['id']}")
            postal_updates = []
            preserved_postal_codes = 0
            for row in data["villages"]:
                existing = existing_villages.get(row["id"])
                if not existing:
                    continue
                if existing["district__code"] != row["districtId"]:
                    raise CommandError(f"Relasi kelurahan existing berbeda; tidak ditimpa: {row['id']}")
                postal = row.get("postalCode", "")
                if postal and not existing["postal_code"]:
                    postal_updates.append(Village(id=existing["id"], postal_code=postal))
                elif postal and existing["postal_code"] != postal:
                    preserved_postal_codes += 1

            self.stdout.write(f"Provinsi baru: {len(province_codes - existing_provinces)}")
            self.stdout.write(f"Kota/kabupaten baru: {len(city_codes - set(existing_cities))}")
            self.stdout.write(f"Kecamatan baru: {len(district_codes - set(existing_districts))}")
            self.stdout.write(f"Kelurahan/desa baru: {len(village_codes - set(existing_villages))}")
            self.stdout.write(f"Kode pos kosong yang akan diisi: {len(postal_updates)}")
            if preserved_postal_codes:
                self.stdout.write(self.style.WARNING(f"Kode pos existing yang berbeda tetap dipertahankan: {preserved_postal_codes}"))
            if options["dry_run"]:
                self.stdout.write(self.style.SUCCESS("Dry run selesai. Tidak ada perubahan database."))
                return

            Province.objects.using(alias).bulk_create([
                Province(code=row["id"], name=row["name"])
                for row in data["provinces"] if row["id"] not in existing_provinces
            ], batch_size=1000)
            provinces = {row.code: row for row in Province.objects.using(alias).all()}
            City.objects.using(alias).bulk_create([
                City(code=row["id"], name=row["name"], province=provinces[row["provinceId"]])
                for row in data["cities"] if row["id"] not in existing_cities
            ], batch_size=1000)
            cities = {row.code: row for row in City.objects.using(alias).all()}
            District.objects.using(alias).bulk_create([
                District(code=row["id"], name=row["name"], city=cities[row["cityId"]])
                for row in data["districts"] if row["id"] not in existing_districts
            ], batch_size=1000)
            districts = {row.code: row for row in District.objects.using(alias).all()}
            Village.objects.using(alias).bulk_create([
                Village(code=row["id"], name=row["name"], district=districts[row["districtId"]], postal_code=row.get("postalCode", ""))
                for row in data["villages"] if row["id"] not in existing_villages
            ], batch_size=2000)
            if postal_updates:
                Village.objects.using(alias).bulk_update(postal_updates, ["postal_code"], batch_size=1000)
            total = Village.objects.using(alias).count()
            with_postal = Village.objects.using(alias).exclude(postal_code="").count()
            self.stdout.write(self.style.SUCCESS(
                f"Selesai. Provinsi: {Province.objects.using(alias).count()}, "
                f"kota/kabupaten: {City.objects.using(alias).count()}, "
                f"kecamatan: {District.objects.using(alias).count()}, "
                f"kelurahan/desa: {total}, dengan kode pos: {with_postal}, "
                f"tanpa kode pos: {total - with_postal}."
            ))
