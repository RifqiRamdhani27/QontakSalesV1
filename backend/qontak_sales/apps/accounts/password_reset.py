from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

User = get_user_model()


def send_reset_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    link = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
    send_mail(
        subject="Reset password akun kamu",
        message=(
            f"Halo {user.first_name},\n\n"
            "Kami menerima permintaan untuk mengganti password akun kamu.\n"
            "Klik link berikut untuk membuat password baru:\n"
            f"{link}\n\n"
            "Link berlaku 1 jam dan hanya bisa dipakai sekali. "
            "Kalau kamu tidak merasa meminta ini, abaikan saja email ini."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )


def get_user_from_uid_token(uid, token):
    try:
        user = User.objects.get(pk=force_str(urlsafe_base64_decode(uid)))
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return None
    if not default_token_generator.check_token(user, token):
        return None
    return user