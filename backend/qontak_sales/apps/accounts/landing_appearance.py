
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .settings_models import LandingAppearance
from .settings_permissions import SettingsPermission, request_settings_access

LIMITS = {
    "hero": {"title": 120, "description": 300, "buttonText": 30, "image": 2048},
    "closing": {"title": 120, "description": 300, "buttonText": 30, "secondaryButtonText": 30},
    "faqs": {"items": 8, "q": 160, "a": 600},
    "contact": {"whatsapp": 40, "instagram": 100, "email": 254},
    "testimonial": {"items": 10, "quote": 500, "name": 80, "position": 100},
    "gallery": {"items": 5, "label": 40},
    "newsletter": {"title": 120, "description": 300},
    "workspace": {"greeting": 120, "bannerTitle": 160, "trainingTitle": 80, "trainingDescription": 160},
    "plans": {"items": 6, "name": 40, "price": 30, "tagline": 100, "featureItems": 10, "feature": 100, "cta": 30, "action": 30},
    "solutions": {"items": 6, "tag": 40, "title": 80, "desc": 300},
    "steps": {"items": 6, "title": 80, "desc": 300, "badge": 50},
    "security": {"items": 6, "title": 80, "desc": 300, "icon": 40},
}

INSTAGRAM_HOSTS = {"instagram.com", "www.instagram.com"}
INSTAGRAM_RESERVED = {
    "p", "reel", "reels", "tv", "stories", "explore", "accounts", "direct", "about",
    "legal", "developer", "api", "graphql", "challenge", "emails", "session", "web",
    "privacy", "terms", "help", "directory", "topics", "locations",
}


def _text(value, label, limit, required=True):
    if not isinstance(value, str):
        value = "" if value is None else str(value)
    value = value.strip()
    if required and not value:
        raise ValidationError({label: "Wajib diisi."})
    if len(value) > limit:
        raise ValidationError({label: f"Maksimal {limit} karakter."})
    return value


def _instagram_url(value):
    raw = (value or "").strip()
    if not raw:
        return ""
    candidate = raw if "://" in raw else f"https://{raw}"
    from urllib.parse import urlparse

    parsed = urlparse(candidate)
    if parsed.scheme not in ("http", "https"):
        raise ValidationError({"instagram": "Gunakan link https://www.instagram.com/username/."})
    if parsed.netloc.lower() not in INSTAGRAM_HOSTS:
        raise ValidationError({"instagram": "Host harus instagram.com."})
    if "@" in parsed.netloc:
        raise ValidationError({"instagram": "Link tidak boleh memuat kredensial."})
    segments = [part for part in parsed.path.split("/") if part]
    if len(segments) != 1:
        raise ValidationError({"instagram": "Gunakan link profil, bukan link postingan/Reels."})
    username = segments[0]
    if not username.replace("_", "").replace(".", "").isalnum() or len(username) > 30:
        raise ValidationError({"instagram": "Username pada link tidak valid."})
    if username.lower() in INSTAGRAM_RESERVED:
        raise ValidationError({"instagram": "Itu bukan halaman profil Instagram."})
    return f"https://www.instagram.com/{username}/"


def _whatsapp(value):
    raw = (value or "").strip()
    if not raw:
        return ""
    digits = "".join(ch for ch in raw if ch.isdigit()) if "wa.me/" not in raw else raw.rsplit("wa.me/", 1)[1]
    digits = "".join(ch for ch in digits if ch.isdigit())
    if digits.startswith("0"):
        digits = f"62{digits[1:]}"
    if not (8 <= len(digits) <= 15):
        raise ValidationError({"whatsapp": "Nomor WhatsApp belum valid."})
    return raw


def _image(value):
    return _image_item(value, "image")


def _image_item(value, label):
    raw = (value or "").strip()
    if not raw:
        return ""
    if raw.startswith("data:"):
        raise ValidationError(
            {label: "Gambar harus berupa URL hasil unggahan, bukan data gambar mentah."}
        )
    if len(raw) > LIMITS["hero"]["image"]:
        raise ValidationError({label: "URL gambar terlalu panjang (maksimal 2048 karakter)."})
    if raw.startswith("/") and not raw.startswith("//"):
        return raw
    if not raw.lower().startswith(("http://", "https://")):
        raise ValidationError({label: "Gunakan URL http(s) hasil unggahan atau path aset."})
    return raw


def validate_landing_content(data):
    if not isinstance(data, dict):
        raise ValidationError({"detail": "Konten harus berupa objek JSON."})

    hero = data.get("hero") or {}
    closing = data.get("closing") or {}
    faqs = data.get("faqs") or []
    contact = data.get("contact") or {}
    testimonial = data.get("testimonial")
    testimonials = data.get("testimonials")
    gallery = data.get("gallery") or []
    newsletter = data.get("newsletter") or {}
    workspace = data.get("workspace") or {}
    plans = data.get("plans")
    solutions = data.get("solutions")
    steps = data.get("steps")
    security = data.get("security")

    if not isinstance(hero, dict) or not isinstance(closing, dict):
        raise ValidationError({"detail": "Struktur hero/closing tidak valid."})
    if not isinstance(faqs, list):
        raise ValidationError({"faqs": "FAQ harus berupa list."})
    if len(faqs) > LIMITS["faqs"]["items"]:
        raise ValidationError({"faqs": f"FAQ maksimal {LIMITS['faqs']['items']} item."})
    if not isinstance(contact, dict):
        raise ValidationError({"contact": "Kontak harus berupa objek."})
    if not isinstance(newsletter, dict):
        raise ValidationError({"newsletter": "Newsletter harus berupa objek."})
    if not isinstance(workspace, dict):
        raise ValidationError({"workspace": "Beranda harus berupa objek."})
    if not isinstance(gallery, list):
        raise ValidationError({"gallery": "Galeri harus berupa list."})
    if len(gallery) != LIMITS["gallery"]["items"]:
        raise ValidationError({"gallery": f"Galeri harus berisi {LIMITS['gallery']['items']} gambar."})

    clean_faqs = []
    for index, item in enumerate(faqs):
        if not isinstance(item, dict):
            raise ValidationError({"faqs": f"FAQ item {index + 1} tidak valid."})
        clean_faqs.append(
            {
                "id": str(item.get("id") or f"faq-{index + 1}")[:64],
                "q": _text(item.get("q"), f"faqs.{index}.q", LIMITS["faqs"]["q"]),
                "a": _text(item.get("a"), f"faqs.{index}.a", LIMITS["faqs"]["a"]),
            }
        )

    email = _text(contact.get("email"), "contact.email", LIMITS["contact"]["email"], required=False)
    if email and ("@" not in email or "." not in email.rsplit("@", 1)[-1] or " " in email):
        raise ValidationError({"contact.email": "Alamat email tidak valid."})

    clean_gallery = []
    for index, item in enumerate(gallery):
        if not isinstance(item, dict):
            raise ValidationError({"gallery": f"Gambar galeri {index + 1} tidak valid."})
        clean_gallery.append(
            {
                "label": _text(item.get("label"), f"gallery.{index}.label", LIMITS["gallery"]["label"]),
                "image": _image_item(item.get("image"), f"gallery.{index}.image"),
            }
        )

    # Testimonials (mendukung list multi-orang dan single dict legacy)
    clean_testimonials = None
    clean_single_testimonial = None

    if testimonials is not None:
        if not isinstance(testimonials, list):
            raise ValidationError({"testimonials": "Testimoni harus berupa list."})
        if len(testimonials) > LIMITS["testimonial"]["items"]:
            raise ValidationError({"testimonials": f"Testimoni maksimal {LIMITS['testimonial']['items']} item."})
        clean_testimonials = []
        for index, item in enumerate(testimonials):
            if not isinstance(item, dict):
                raise ValidationError({"testimonials": f"Item testimoni {index + 1} tidak valid."})
            clean_testimonials.append(
                {
                    "id": str(item.get("id") or f"testi-{index + 1}")[:64],
                    "quote": _text(item.get("quote"), f"testimonials.{index}.quote", LIMITS["testimonial"]["quote"]),
                    "name": _text(item.get("name"), f"testimonials.{index}.name", LIMITS["testimonial"]["name"]),
                    "position": _text(item.get("position"), f"testimonials.{index}.position", LIMITS["testimonial"]["position"]),
                    "image": _image_item(item.get("image"), f"testimonials.{index}.image"),
                }
            )
        if clean_testimonials:
            clean_single_testimonial = clean_testimonials[0]

    if testimonial is not None:
        if isinstance(testimonial, list):
            if len(testimonial) > LIMITS["testimonial"]["items"]:
                raise ValidationError({"testimonial": f"Testimoni maksimal {LIMITS['testimonial']['items']} item."})
            parsed_testis = []
            for index, item in enumerate(testimonial):
                if not isinstance(item, dict):
                    raise ValidationError({"testimonial": f"Item testimoni {index + 1} tidak valid."})
                parsed_testis.append(
                    {
                        "id": str(item.get("id") or f"testi-{index + 1}")[:64],
                        "quote": _text(item.get("quote"), f"testimonial.{index}.quote", LIMITS["testimonial"]["quote"]),
                        "name": _text(item.get("name"), f"testimonial.{index}.name", LIMITS["testimonial"]["name"]),
                        "position": _text(item.get("position"), f"testimonial.{index}.position", LIMITS["testimonial"]["position"]),
                        "image": _image_item(item.get("image"), f"testimonial.{index}.image"),
                    }
                )
            clean_testimonials = parsed_testis
            clean_single_testimonial = clean_testimonials[0] if clean_testimonials else None
        elif isinstance(testimonial, dict):
            clean_single_testimonial = {
                "quote": _text(testimonial.get("quote"), "testimonial.quote", LIMITS["testimonial"]["quote"]),
                "name": _text(testimonial.get("name"), "testimonial.name", LIMITS["testimonial"]["name"]),
                "position": _text(testimonial.get("position"), "testimonial.position", LIMITS["testimonial"]["position"]),
                "image": _image_item(testimonial.get("image"), "testimonial.image"),
            }
            if clean_testimonials is None:
                clean_testimonials = [clean_single_testimonial]
        else:
            raise ValidationError({"testimonial": "Testimoni harus berupa objek atau list."})
    elif clean_single_testimonial is None:
        clean_single_testimonial = {"quote": "", "name": "", "position": "", "image": ""}

    # Plans / Paket Langganan
    clean_plans = None
    if plans is not None:
        if not isinstance(plans, list):
            raise ValidationError({"plans": "Daftar paket harus berupa list."})
        if len(plans) > LIMITS["plans"]["items"]:
            raise ValidationError({"plans": f"Paket maksimal {LIMITS['plans']['items']} item."})
        clean_plans = []
        for index, item in enumerate(plans):
            if not isinstance(item, dict):
                raise ValidationError({"plans": f"Item paket {index + 1} tidak valid."})
            raw_features = item.get("features") or []
            if not isinstance(raw_features, list):
                raise ValidationError({f"plans.{index}.features": "Fitur paket harus berupa list."})
            if len(raw_features) > LIMITS["plans"]["featureItems"]:
                raise ValidationError({f"plans.{index}.features": f"Fitur paket maksimal {LIMITS['plans']['featureItems']} baris."})
            clean_features = [
                _text(feat, f"plans.{index}.features.{f_idx}", LIMITS["plans"]["feature"])
                for f_idx, feat in enumerate(raw_features)
            ]
            clean_plans.append(
                {
                    "id": str(item.get("id") or f"plan-{index + 1}")[:64],
                    "name": _text(item.get("name"), f"plans.{index}.name", LIMITS["plans"]["name"]),
                    "price": _text(item.get("price"), f"plans.{index}.price", LIMITS["plans"]["price"]),
                    "tagline": _text(item.get("tagline"), f"plans.{index}.tagline", LIMITS["plans"]["tagline"], required=False),
                    "features": clean_features,
                    "cta": _text(item.get("cta"), f"plans.{index}.cta", LIMITS["plans"]["cta"]),
                    "action": _text(item.get("action", "register"), f"plans.{index}.action", LIMITS["plans"]["action"]),
                    "popular": bool(item.get("popular", False)),
                }
            )

    # Solutions / Solusi Industri
    clean_solutions = None
    if solutions is not None:
        if not isinstance(solutions, list):
            raise ValidationError({"solutions": "Solusi harus berupa list."})
        if len(solutions) > LIMITS["solutions"]["items"]:
            raise ValidationError({"solutions": f"Solusi maksimal {LIMITS['solutions']['items']} item."})
        clean_solutions = []
        for index, item in enumerate(solutions):
            if not isinstance(item, dict):
                raise ValidationError({"solutions": f"Item solusi {index + 1} tidak valid."})
            clean_solutions.append(
                {
                    "id": str(item.get("id") or f"sol-{index + 1}")[:64],
                    "tag": _text(item.get("tag"), f"solutions.{index}.tag", LIMITS["solutions"]["tag"], required=False),
                    "title": _text(item.get("title"), f"solutions.{index}.title", LIMITS["solutions"]["title"]),
                    "desc": _text(item.get("desc"), f"solutions.{index}.desc", LIMITS["solutions"]["desc"]),
                    "image": _image_item(item.get("image"), f"solutions.{index}.image"),
                    "dark": bool(item.get("dark", False)),
                }
            )

    # Steps / Alur Kerja
    clean_steps = None
    if steps is not None:
        if not isinstance(steps, list):
            raise ValidationError({"steps": "Alur langkah harus berupa list."})
        if len(steps) > LIMITS["steps"]["items"]:
            raise ValidationError({"steps": f"Alur langkah maksimal {LIMITS['steps']['items']} item."})
        clean_steps = []
        for index, item in enumerate(steps):
            if not isinstance(item, dict):
                raise ValidationError({"steps": f"Item langkah {index + 1} tidak valid."})
            clean_steps.append(
                {
                    "id": str(item.get("id") or f"step-{index + 1}")[:64],
                    "title": _text(item.get("title"), f"steps.{index}.title", LIMITS["steps"]["title"]),
                    "desc": _text(item.get("desc"), f"steps.{index}.desc", LIMITS["steps"]["desc"]),
                    "badge": _text(item.get("badge"), f"steps.{index}.badge", LIMITS["steps"]["badge"], required=False),
                }
            )

    # Security / Poin Keamanan
    clean_security = None
    if security is not None:
        if not isinstance(security, list):
            raise ValidationError({"security": "Poin keamanan harus berupa list."})
        if len(security) > LIMITS["security"]["items"]:
            raise ValidationError({"security": f"Poin keamanan maksimal {LIMITS['security']['items']} item."})
        clean_security = []
        for index, item in enumerate(security):
            if not isinstance(item, dict):
                raise ValidationError({"security": f"Item keamanan {index + 1} tidak valid."})
            clean_security.append(
                {
                    "id": str(item.get("id") or f"sec-{index + 1}")[:64],
                    "title": _text(item.get("title"), f"security.{index}.title", LIMITS["security"]["title"]),
                    "desc": _text(item.get("desc"), f"security.{index}.desc", LIMITS["security"]["desc"]),
                    "icon": _text(item.get("icon", "ShieldCheck"), f"security.{index}.icon", LIMITS["security"]["icon"], required=False),
                }
            )

    res = {
        "hero": {
            "title": _text(hero.get("title"), "hero.title", LIMITS["hero"]["title"]),
            "description": _text(hero.get("description"), "hero.description", LIMITS["hero"]["description"]),
            "buttonText": _text(hero.get("buttonText"), "hero.buttonText", LIMITS["hero"]["buttonText"]),
            "image": _image(hero.get("image")),
        },
        "closing": {
            "title": _text(closing.get("title"), "closing.title", LIMITS["closing"]["title"]),
            "description": _text(closing.get("description"), "closing.description", LIMITS["closing"]["description"]),
            "buttonText": _text(closing.get("buttonText"), "closing.buttonText", LIMITS["closing"]["buttonText"]),
            "secondaryButtonText": _text(
                closing.get("secondaryButtonText"),
                "closing.secondaryButtonText",
                LIMITS["closing"]["secondaryButtonText"],
            ),
        },
        "faqs": clean_faqs,
        "contact": {
            "whatsapp": _whatsapp(_text(contact.get("whatsapp"), "contact.whatsapp", LIMITS["contact"]["whatsapp"], required=False)),
            "instagram": _instagram_url(
                _text(contact.get("instagram"), "contact.instagram", LIMITS["contact"]["instagram"], required=False)
            ),
            "email": email,
        },
        "testimonial": clean_single_testimonial,
        "gallery": clean_gallery,
        "newsletter": {
            "title": _text(newsletter.get("title"), "newsletter.title", LIMITS["newsletter"]["title"]),
            "description": _text(
                newsletter.get("description"),
                "newsletter.description",
                LIMITS["newsletter"]["description"],
                required=False,
            ),
        },
        "workspace": {
            "greeting": _text(workspace.get("greeting"), "workspace.greeting", LIMITS["workspace"]["greeting"]),
            "bannerTitle": _text(workspace.get("bannerTitle"), "workspace.bannerTitle", LIMITS["workspace"]["bannerTitle"]),
            "trainingTitle": _text(
                workspace.get("trainingTitle"), "workspace.trainingTitle", LIMITS["workspace"]["trainingTitle"]
            ),
            "trainingDescription": _text(
                workspace.get("trainingDescription"),
                "workspace.trainingDescription",
                LIMITS["workspace"]["trainingDescription"],
                required=False,
            ),
        },
    }

    if clean_plans is not None:
        res["plans"] = clean_plans
    if clean_testimonials is not None:
        res["testimonials"] = clean_testimonials
    if clean_solutions is not None:
        res["solutions"] = clean_solutions
    if clean_steps is not None:
        res["steps"] = clean_steps
    if clean_security is not None:
        res["security"] = clean_security

    return res


def appearance_payload(item):
    return {
        "content": item.content or None,
        "published_at": item.published_at.isoformat() if item.published_at else None,
    }


class PublicLandingAppearanceView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        item = LandingAppearance.objects.filter(pk=LandingAppearance.SINGLETON_PK).first()
        if item is None:
            return Response({"content": None, "published_at": None})
        return Response(appearance_payload(item))


class LandingAppearanceView(APIView):
    permission_classes = [SettingsPermission]
    settings_feature = "Appearance"

    def get_settings_features(self):
        return ("Appearance",)

    def get(self, request):
        item = LandingAppearance.load()
        payload = appearance_payload(item)
        payload["can_edit"] = request_settings_access(request)["is_admin"]
        return Response(payload)

    def put(self, request):
        content = validate_landing_content(request.data.get("content", request.data))
        item = LandingAppearance.load()
        item.content = content
        item.published_at = timezone.now()
        item.updated_by = request.user
        item.save()
        return Response(appearance_payload(item), status=status.HTTP_200_OK)
