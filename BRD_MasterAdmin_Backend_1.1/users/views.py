from rest_framework import viewsets, permissions, filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny 
from rest_framework.decorators import authentication_classes, permission_classes # Optional imports

from .models import User, AuditLog
from .serializers import UserSerializer, AuditLogSerializer, UserSignupSerializer

from .models import User, AuditLog, LoginActivity
from .serializers import UserSerializer, AuditLogSerializer, UserSignupSerializer, LoginActivitySerializer, ChangePasswordSerializer, MasterAdminTokenSerializer, TenantTokenSerializer
import pyotp
import qrcode
from io import BytesIO
import base64
from .serializers import TwoFASerializer
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer

# --- 1. User ViewSet (Protected) ---
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- 2. Audit Log ViewSet (Protected) ---
class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.select_related('user').all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['action_type', 'user', 'module']
    search_fields = ['description', 'user__email', 'ip_address']

# --- 3. Signup View (Public) ---
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [AllowAny] 
    authentication_classes = [] # ✅ Ye line add karo: Token check disable karega


class Setup2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Generate new secret
        secret = pyotp.random_base32()
        user.two_fa_secret = secret
        user.save()

        # Generate QR code for authenticator apps
        otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=user.email, issuer_name="MyApp"
        )
        img = qrcode.make(otp_uri)
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        qr_code_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return Response({"qr_code": f"data:image/png;base64,{qr_code_str}"})
    

class Verify2FALoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        user = User.objects.filter(email=email).first()
        if not user or not user.two_fa_secret:
            return Response({"detail": "Invalid request"}, status=400)

        totp = pyotp.TOTP(user.two_fa_secret)
        if not totp.verify(code):
            return Response({"detail": "Invalid 2FA code"}, status=400)

        refresh = RefreshToken.for_user(user)

        LoginActivity.objects.create(
            user=user,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            successful=True
        )

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })



class Verify2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TwoFASerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"]

        user = request.user
        totp = pyotp.TOTP(user.two_fa_secret)
        if totp.verify(code):
            user.is_2fa_enabled = True
            user.save()
            return Response({"message": "2FA enabled successfully"})
        return Response({"message": "Invalid 2FA code"}, status=status.HTTP_400_BAD_REQUEST)


class Disable2FAView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_2fa_enabled = False
        user.two_fa_secret = ""
        user.save()
        return Response({"message": "2FA disabled successfully"})



# ---------------------------
# 1. User ViewSet
# ---------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# ---------------------------
# 2. Audit Log ViewSet
# ---------------------------
class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.select_related('user').all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['action_type', 'user', 'module']
    search_fields = ['description', 'user__email', 'ip_address']


# ---------------------------
# 3. Signup View (Public)
# ---------------------------
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


# ---------------------------
# 4. Current User View (GET + UPDATE)
# ---------------------------
# users/views.py

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # ← important for file uploads

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            # Return updated user
            updated_serializer = UserSerializer(request.user, context={'request': request})
            return Response(updated_serializer.data)
        return Response(serializer.errors, status=400)


# users/views.py

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginActivityListAPIView(generics.ListAPIView):
    serializer_class = LoginActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LoginActivity.objects.filter(user=user).order_by("-timestamp")


# class LoginActivityListAPIView(generics.ListAPIView):
#     serializer_class = LoginActivitySerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         # Return activities for the current user or failed attempts for this username
#         return LoginActivity.objects.filter(
#             Q(user=user) | Q(username=user.username)
#         ).order_by("-timestamp")


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def get_serializer_context(self):
        return {
            "request": self.request,  # 👈 VERY IMPORTANT
            "view": self,
        }


class MasterAdminLoginView(TokenObtainPairView):
    serializer_class = MasterAdminTokenSerializer


class TenantLoginView(TokenObtainPairView):
    serializer_class = TenantTokenSerializer