from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated


# MODELS
from .models import (
    Tenant,
    Branch,
    FinancialYear,
    ReportingPeriod,
    Holiday,
    TenantRuleConfig,
    Category
)

# SERIALIZERS
from .serializers import (
    TenantSerializer,
    BranchSerializer,
    TenantSignupSerializer,
    FinancialYearSerializer,
    ReportingPeriodSerializer,
    HolidaySerializer,
    CategorySerializer,
    TenantRuleConfigSerializer,
    TenantCreateByMasterSerializer
  
)

User = get_user_model()


# --------------------------------------------------------
#                   PERMISSIONS
# --------------------------------------------------------
class IsMasterOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = getattr(request, "user", None)
        return bool(user and (user.role == "MASTER_ADMIN" or user.is_superuser))


# --------------------------------------------------------
#                   TENANT VIEWS
# --------------------------------------------------------
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all().order_by('-created_at')
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated, IsMasterOrReadOnly]
    lookup_field = 'tenant_id'

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.role == "MASTER_ADMIN":
            return Tenant.objects.all().order_by('-created_at')

        if hasattr(user, "tenant"):
            return Tenant.objects.filter(pk=user.tenant.pk)

        return Tenant.objects.none()


# --------------------------------------------------------
#                   BRANCH VIEWS
# --------------------------------------------------------
class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all().order_by('-created_at')
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_superuser or user.role == "MASTER_ADMIN":
            return Branch.objects.all()

        if hasattr(user, "tenant"):
            return Branch.objects.filter(tenant=user.tenant)

        return Branch.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        # Normal tenant user → force assign tenant
        if not (user.is_superuser or user.role == "MASTER_ADMIN"):
            serializer.save(tenant=user.tenant)
        else:
            serializer.save()


# --------------------------------------------------------
#                TENANT SIGNUP (PUBLIC)
# --------------------------------------------------------
class TenantSignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = TenantSignupSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Signup successful",
            "tenant_id": str(user.tenant.tenant_id),
            "email": user.email,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=201)

class TenantCreateByMasterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TenantCreateByMasterSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.save()  # 👈 serializer must return dict

        return Response({
            "tenant_id": str(data["tenant_id"]),
            "email": data["email"],
            "password": data["password"],
        }, status=status.HTTP_201_CREATED)
# --------------------------------------------------------
#            BASE VIEW FOR TENANT FILTERING
# --------------------------------------------------------
# class BaseTenantViewSet(viewsets.ModelViewSet):
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return self.queryset.filter(tenant=user.tenant)

#     def perform_create(self, serializer):
#         serializer.save(tenant=self.request.user.tenant)

class BaseTenantViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

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
            tenant = Tenant.objects.first()
            if not tenant:
                raise ValidationError({"tenant": "No tenants exist in the system"})
            serializer.save(tenant=tenant)
            return

        raise ValidationError({"tenant": "User is not linked to a tenant"})


# ---------------------- FINANCIAL YEAR ----------------------
class FinancialYearViewSet(BaseTenantViewSet):
    queryset = FinancialYear.objects.all()
    serializer_class = FinancialYearSerializer


# ---------------------- REPORTING PERIOD ----------------------
class ReportingPeriodViewSet(BaseTenantViewSet):
    queryset = ReportingPeriod.objects.all()
    serializer_class = ReportingPeriodSerializer


# ---------------------- HOLIDAY ----------------------
class HolidayViewSet(BaseTenantViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer

# -----------------------------------------------------------
# NEW CATEGORY VIEWSET  (Types of Category)
# -----------------------------------------------------------

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by("category_key", "title")
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, "role", "") == "MASTER_ADMIN":
            return Category.objects.all()

        if hasattr(user, "tenant"):
            return Category.objects.filter(tenant=user.tenant)

        return Category.objects.none()

    def perform_create(self, serializer):
        """
        Tenant user cannot send tenant ID manually → we attach automatically.
        """
        user = self.request.user
        tenant = user.tenant if hasattr(user, "tenant") else None
        # serializer.save(tenant=tenant)
        serializer.save(tenant=self.request.user.tenant)


# --------------------------------------------------------
#               RULE CONFIG VIEWSET
# --------------------------------------------------------
# views.py

class TenantRuleConfigViewSet(viewsets.ModelViewSet):
    queryset = TenantRuleConfig.objects.all()
    serializer_class = TenantRuleConfigSerializer

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, "tenant") or not user.tenant:
            return TenantRuleConfig.objects.none()

        return TenantRuleConfig.objects.filter(tenant=user.tenant)

    def perform_create(self, serializer):
        user = self.request.user
        tenant = user.tenant
        serializer.save(tenant=tenant)  # 🔥 the correct fix
