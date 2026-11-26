from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Company, ProductionSetting, Role
from .permissions import IsManager, IsManagerOrReadOnly
from .serializers import (
    AgentCreateSerializer,
    CompanySerializer,
    EmailTokenObtainPairSerializer,
    InviteMemberSerializer,
    MemberSerializer,
    ProductionSettingSerializer,
    RegisterSerializer,
    RoleSerializer,
    UserSerializer,
)
import logging
from django.core import signing
from rest_framework.throttling import AnonRateThrottle
from .email_verification import read_token, send_verification_email
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from .password_reset import get_user_from_uid_token, send_reset_email


logger = logging.getLogger(__name__)

User = get_user_model()


class EmailTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        try:
            send_verification_email(user)
        except Exception:
            logger.exception("Gagal kirim email verifikasi ke %s", user.email)
        return Response(
            {"message": "Registration successful. Check your email to verify your account."},
            status=status.HTTP_201_CREATED,
        )

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            payload = read_token(request.data.get("token", ""))
            user = User.objects.get(pk=payload["uid"], email=payload["email"])
        except (signing.BadSignature, User.DoesNotExist, KeyError):
            return Response(
                {"detail": "Link tidak valid atau sudah kadaluarsa."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not user.email_verified:
            user.email_verified = True
            user.save(update_fields=["email_verified"])
        return Response({"message": "Email verified."})


class ResendThrottle(AnonRateThrottle):
    scope = "resend_verification"
    rate = "5/hour"


class ResendVerificationView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ResendThrottle]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        user = User.objects.filter(email__iexact=email, email_verified=False).first()
        if user:
            try:
                send_verification_email(user)
            except Exception:
                logger.exception("Gagal kirim ulang email verifikasi ke %s", user.email)
        return Response({"message": "Jika email terdaftar dan belum diverifikasi, link baru sudah dikirim."})

class ForgotPasswordThrottle(AnonRateThrottle):
    scope = "forgot_password"
    rate = "5/hour"


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ForgotPasswordThrottle]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user:
            try:
                send_reset_email(user)
            except Exception:
                logger.exception("Gagal kirim email reset password ke %s", user.email)
        # jawaban selalu sama supaya orang tidak bisa menebak email mana yang terdaftar
        return Response({"message": "Jika email terdaftar, link reset password sudah dikirim."})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = get_user_from_uid_token(
            request.data.get("uid", ""), request.data.get("token", "")
        )
        if user is None:
            return Response(
                {"detail": "Link tidak valid atau sudah kadaluarsa."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        password = request.data.get("password", "")
        try:
            validate_password(password, user)
        except DjangoValidationError as e:
            return Response({"detail": " ".join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        # user terbukti memegang inbox email ini, jadi sekalian dianggap terverifikasi
        user.email_verified = True
        user.save(update_fields=["password", "email_verified"])
        return Response({"message": "Password berhasil diubah."})
        
class ProfileView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data)

    def put(self, request):
        user = request.user
        for field in ("first_name", "last_name", "email", "phone"):
            if field in request.data:
                setattr(user, field, request.data[field])
        if "avatar" in request.FILES:
            user.avatar = request.FILES["avatar"]
        user.save()
        return Response(UserSerializer(user, context={"request": request}).data)


class CompanyDetailView(APIView):
    permission_classes = [IsManagerOrReadOnly]

    def get(self, request):
        serializer = CompanySerializer(request.user.company, context={"request": request})
        return Response(serializer.data)

    def put(self, request):
        serializer = CompanySerializer(
            request.user.company, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DashboardStatsView(APIView):
    def get(self, request):
        company = request.user.company
        users = User.objects.filter(company=company) if company else User.objects.none()
        agents = users.filter(role="AGENT")
        managers = users.filter(role="MANAGER")
        return Response({
            "company_name": company.name if company else "",
            "total_users": users.count(),
            "total_agents": agents.count(),
            "total_managers": managers.count(),
        })


class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return User.objects.filter(company=self.request.user.company, role="AGENT").order_by("first_name", "last_name")

    def create(self, request, *args, **kwargs):
        serializer = AgentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        agent = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone", ""),
            company=request.user.company,
            role="AGENT",
        )
        if data.get("avatar"):
            agent.avatar = data["avatar"]
            agent.save(update_fields=["avatar"])
        return Response(UserSerializer(agent, context={"request": request}).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        agent = self.get_object()
        for field in ("first_name", "last_name", "email", "phone"):
            if field in request.data:
                setattr(agent, field, request.data[field])
        if "avatar" in request.FILES:
            agent.avatar = request.FILES["avatar"]
        agent.save()
        return Response(UserSerializer(agent, context={"request": request}).data)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return User.objects.filter(
            company=self.request.user.company
        ).order_by("first_name", "last_name")

    def create(self, request, *args, **kwargs):
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        import secrets
        member = User.objects.create_user(
            username=data["username"],
            email=data.get("email", ""),
            password=secrets.token_urlsafe(16),
            company=request.user.company,
            role="AGENT",
            status="invited",
            type=data.get("type", "member"),
            access_time_limit=data.get("access_time_limit", ""),
        )
        member.roles.set(data.get("roles", []))
        return Response(
            MemberSerializer(member).data, status=status.HTTP_201_CREATED
        )

    def partial_update(self, request, *args, **kwargs):
        member = self.get_object()
        for field in ("status", "type", "access_time_limit"):
            if field in request.data:
                setattr(member, field, request.data[field])
        member.save()
        if "roles" in request.data:
            member.roles.set(
                Role.objects.filter(id__in=request.data.getlist("roles"))
            )
        return Response(MemberSerializer(member).data)


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        return Role.objects.all().order_by("name")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = serializer.save()
        return Response(self.get_serializer(role).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        role = self.get_object()
        if role.is_default:
            return Response(
                {"detail": "Role bawaan tidak dapat dihapus."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        role.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductionSettingDetailView(APIView):
    permission_classes = [IsManagerOrReadOnly]

    def get(self, request):
        setting, _created = ProductionSetting.objects.get_or_create(pk=1)
        return Response(ProductionSettingSerializer(setting).data)

    def put(self, request):
        setting, _created = ProductionSetting.objects.get_or_create(pk=1)
        serializer = ProductionSettingSerializer(setting, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
