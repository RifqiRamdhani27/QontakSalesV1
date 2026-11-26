from django.conf import settings
from django.core import signing
from django.core.mail import send_mail

SALT = "email-verify"
MAX_AGE = 60 * 60 * 24  # token berlaku 24 jam


def make_token(user):
    return signing.dumps({"uid": user.pk, "email": user.email}, salt=SALT)


def read_token(token):
    # akan error (BadSignature) kalau token palsu atau kadaluarsa
    return signing.loads(token, salt=SALT, max_age=MAX_AGE)


def send_verification_email(user):
    link = f"{settings.FRONTEND_URL}/verify-email?token={make_token(user)}"
    send_mail(
        subject="Verifikasi email akun kamu",
        message=(
            f"Halo {user.first_name},\n\n"
            "Klik link berikut untuk mengaktifkan akun kamu:\n"
            f"{link}\n\n"
            "Link berlaku 24 jam. Kalau kamu tidak merasa mendaftar, abaikan email ini."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )