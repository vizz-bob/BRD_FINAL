from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import TenantSerializer
# MODELS

from .models import (
    Tenant, Branch, FinancialYear, ReportingPeriod, Holiday,
    TenantRuleConfig, Category, InterestConfig, ChargeConfig,
    RepaymentConfig, RiskRule, ScoreCard, TenantLoanProduct
)

# SERIALIZERS
from .serializers import (
    TenantSerializer, BranchSerializer, TenantSignupSerializer, TenantTokenSerializer,
    FinancialYearSerializer, ReportingPeriodSerializer, HolidaySerializer,
    CategorySerializer, TenantRuleConfigSerializer,
    TenantCreateByMasterSerializer, InterestConfigSerializer,
    ChargeConfigSerializer, RepaymentConfigSerializer, RiskRuleSerializer,
    ScoreCardSerializer, TenantLoanProductSerializer
)

User = get_user_model()


# -----------------------------
# PERMISSIONS
# -----------------------------
class IsMasterOrReadOnly(permissions.BasePermission):
    """Allow full access only to MASTER_ADMIN or superusers"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = getattr(request, "user", None)
        return bool(user and (user.role == "MASTER_ADMIN" or user.is_superuser))


# -----------------------------
# BASE TENANT VIEWSET
# -----------------------------
class BaseTenantViewSet(viewsets.ModelViewSet):
    """Base class to filter objects by tenant automatically."""
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or getattr(user, 'role', '') == 'MASTER_ADMIN':
            return self.queryset.all()

        if hasattr(user, 'tenant') and user.tenant:
            return self.queryset.filter(tenant=user.tenant)

        return self.queryset.none()

    def perform_create(self, serializer):
        user = self.request.user

        if hasattr(user, 'tenant') and user.tenant:
            serializer.save(tenant=user.tenant)
            return

        if user.is_superuser or getattr(user, 'role', '') == 'MASTER_ADMIN':
            raise ValidationError({
                "tenant": "Tenant must be explicitly provided by master admin"
            })

        raise ValidationError({
            "tenant": "User is not linked to a tenant"
        })



# -----------------------------
# TENANT VIEWS
# -----------------------------
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated, IsMasterOrReadOnly]
    lookup_field = 'tenant_id'

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "MASTER_ADMIN":
            return Tenant.objects.all().order_by('-created_at')
        if hasattr(user, "tenant"):
            return Tenant.objects.filter(pk=user.tenant.pk)
        return Tenant.objects.none()


# -----------------------------
# BRANCH VIEWS
# -----------------------------
class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all().order_by('-created_at')
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == "MASTER_ADMIN":
            return Branch.objects.all()
        if hasattr(user, "tenant"):
            return Branch.objects.filter(tenant=user.tenant)
        return Branch.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == "MASTER_ADMIN"):
            serializer.save(tenant=user.tenant)
        else:
            serializer.save()


# -----------------------------
# TENANT SIGNUP & CREATION
# -----------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model
User = get_user_model()


from .models import Tenant, Subscription
from .serializers import TenantSignupSerializer

class TenantSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("📩 SIGNUP PAYLOAD:", request.data)

        serializer = TenantSignupSerializer(data=request.data)
        if not serializer.is_valid():
            print("❌ VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)

        data = serializer.validated_data

        # 1️⃣ Create auth user
        user = User.objects.create_user(
            email=data["email"],
            password=data["password"]
        )


        # subscription_type = data.get("subscription_type")

        # subscription = Subscription.objects.filter(
        # subscription_name__iexact=subscription_type
        # ).first()

        # if not subscription:
        #     return Response(
        #         {"subscription_type": "Invalid subscription type"},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )



        # 3️⃣ Create tenant
        tenant = Tenant.objects.create(
            name=data["name"],
            email=data["email"],
            phone=data["mobile_no"],
            address=data["address"],
            city=data["city"],
            state=data["state"],
            country=data["country"],
            pincode=data["pincode"],
            cin=data.get("cin"),
            pan=data.get("pan"),
            gstin=data.get("gstin"),
            users_count=data.get("users_count"),
            # subscription=None
        )
        

        return Response(
            {
                "tenant_id": tenant.tenant_id,
                "user_id": user.id,
                "email": user.email,
                "message": "Signup successful"
            },
            status=status.HTTP_201_CREATED
        )
        





class TenantCreateByMasterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TenantCreateByMasterSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()  # Must return dict
        return Response({
            "tenant_id": str(data["tenant_id"]),
            "email": data["email"],
            "password": data["password"],
        }, status=status.HTTP_201_CREATED)


# -----------------------------
# JWT TOKEN VIEW
# -----------------------------
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from django.contrib.auth import authenticate
# from rest_framework import serializers

# class TenantTokenSerializer(TokenObtainPairSerializer):
#     username_field = "email"

#     def validate(self, attrs):
#         email = attrs.get("email")
#         password = attrs.get("password")

#         if not email or not password:
#             raise serializers.ValidationError("Email and password are required")

#         user = authenticate(
#             request=self.context.get("request"),
#             email=email,
#             password=password,
#         )

#         if not user:
#             raise serializers.ValidationError("Invalid email or password")

#         if not user.is_active:
#             raise serializers.ValidationError("User account is disabled")

#         refresh = self.get_token(user)

#         tenant = getattr(user, "tenant", None)

#         return {
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),

#             # ✅ Tenant info
#             "tenant_id": tenant.id if tenant else None,                  # INTEGER (DB ID)
#             "tenant_uuid": str(tenant.tenant_id) if tenant else None,    # UUID
#             "tenant_name": tenant.name if tenant else None,

#             # Optional user info
#             "user": {
#                 "id": user.id,
#                 "email": user.email,
#                 "role": getattr(user, "role", None),
#             }
#         }

class TenantTokenView(TokenObtainPairView):
    serializer_class = TenantTokenSerializer




# -----------------------------
# FINANCIAL, REPORTING & HOLIDAY
# -----------------------------
# class FinancialYearViewSet(BaseTenantViewSet):
#     queryset = FinancialYear.objects.all()
#     serializer_class = FinancialYearSerializer

# calendar_config/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import FinancialYear
from .serializers import FinancialYearSerializer

class FinancialYearListCreateView(generics.ListCreateAPIView):
    queryset = FinancialYear.objects.all()
    serializer_class = FinancialYearSerializer

class FinancialYearDeleteView(generics.DestroyAPIView):
    queryset = FinancialYear.objects.all()
    serializer_class = FinancialYearSerializer



class ReportingPeriodViewSet(BaseTenantViewSet):
    queryset = ReportingPeriod.objects.all()
    serializer_class = ReportingPeriodSerializer


class HolidayViewSet(BaseTenantViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer


# -----------------------------
# CATEGORY VIEWSET
# -----------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by("category_key", "title")
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, "role", "") == "MASTER_ADMIN":
            return Category.objects.all()
        if hasattr(user, "tenant"):
            return Category.objects.filter(tenant=user.tenant)
        return Category.objects.none()

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)


# -----------------------------
# RULE CONFIG
# -----------------------------
class TenantRuleConfigViewSet(viewsets.ModelViewSet):
    queryset = TenantRuleConfig.objects.all()
    serializer_class = TenantRuleConfigSerializer

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, "tenant") or not user.tenant:
            return TenantRuleConfig.objects.none()
        return TenantRuleConfig.objects.filter(tenant=user.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user.tenant)


# -----------------------------
# TENANT MASTERS & PRODUCTS
# -----------------------------
class InterestConfigViewSet(BaseTenantViewSet):
    queryset = InterestConfig.objects.all()
    serializer_class = InterestConfigSerializer


class ChargeConfigViewSet(BaseTenantViewSet):
    queryset = ChargeConfig.objects.all()
    serializer_class = ChargeConfigSerializer


class RepaymentConfigViewSet(BaseTenantViewSet):
    queryset = RepaymentConfig.objects.all()
    serializer_class = RepaymentConfigSerializer


class RiskRuleViewSet(BaseTenantViewSet):
    queryset = RiskRule.objects.all()
    serializer_class = RiskRuleSerializer


class ScoreCardViewSet(BaseTenantViewSet):
    queryset = ScoreCard.objects.all()
    serializer_class = ScoreCardSerializer


class TenantLoanProductViewSet(BaseTenantViewSet):
    queryset = TenantLoanProduct.objects.all()
    serializer_class = TenantLoanProductSerializer
class TenantListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return a list of tenants.
        If user is MASTER_ADMIN or superuser, return all tenants.
        Otherwise, return only the tenant assigned to the user.
        """
        user = request.user

        if user.is_superuser or getattr(user, "role", "") == "MASTER_ADMIN":
            tenants = Tenant.objects.all()
        elif hasattr(user, "tenant") and user.tenant:
            tenants = Tenant.objects.filter(pk=user.tenant.pk)
        else:
            tenants = Tenant.objects.none()

        serializer = TenantSerializer(tenants, many=True)
        return Response(serializer.data)
class TenantTokenView(TokenObtainPairView):
    serializer_class = TenantTokenSerializer