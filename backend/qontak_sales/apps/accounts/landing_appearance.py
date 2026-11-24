
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
    "testimonial": {"quote": 500, "name": 80, "position": 100},
    "gallery": {"items": 5, "label": 40},
    "newsletter": {"title": 120, "description": 300},
    "workspace": {"greeting": 120, "bannerTitle": 160, "trainingTitle": 80, "trainingDescription": 160},
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
    testimonial = data.get("testimonial") or {}
    gallery = data.get("gallery") or []
    newsletter = data.get("newsletter") or {}
    workspace = data.get("workspace") or {}

    if not isinstance(hero, dict) or not isinstance(closing, dict):
        raise ValidationError({"detail": "Struktur hero/closing tidak valid."})
    if not isinstance(faqs, list):
        raise ValidationError({"faqs": "FAQ harus berupa list."})
    if len(faqs) > LIMITS["faqs"]["items"]:
        raise ValidationError({"faqs": f"FAQ maksimal {LIMITS['faqs']['items']} item."})
    if not isinstance(contact, dict):
        raise ValidationError({"contact": "Kontak harus berupa objek."})
    if not isinstance(testimonial, dict):
        raise ValidationError({"testimonial": "Testimoni harus berupa objek."})
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

    return {
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
        "testimonial": {
            "quote": _text(testimonial.get("quote"), "testimonial.quote", LIMITS["testimonial"]["quote"]),
            "name": _text(testimonial.get("name"), "testimonial.name", LIMITS["testimonial"]["name"]),
            "position": _text(testimonial.get("position"), "testimonial.position", LIMITS["testimonial"]["position"]),
            "image": _image_item(testimonial.get("image"), "testimonial.image"),
        },
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
