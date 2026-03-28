from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    TenantViewSet, BranchViewSet, TenantSignupView,
    ReportingPeriodViewSet, HolidayViewSet, TenantRuleConfigViewSet,
    CategoryViewSet, TenantCreateByMasterView, InterestConfigViewSet,
    ChargeConfigViewSet, RepaymentConfigViewSet, RiskRuleViewSet,
    ScoreCardViewSet, TenantLoanProductViewSet,
    TenantTokenView, TenantListView, FinancialYearListCreateView, FinancialYearDeleteView
)

router = DefaultRouter()

# Tenant Rules FIRST
router.register(r'rules-config', TenantRuleConfigViewSet, basename='rules-config')

# Calendar / Category
router.register(r'categories', CategoryViewSet, basename='categories')
# router.register(r'calendar/financial-years', FinancialYearViewSet, basename='financial-years')
router.register(r'calendar/reporting-periods', ReportingPeriodViewSet, basename='reporting-periods')
path("financial-years/", FinancialYearListCreateView.as_view()),
path("financial-years/<int:pk>/", FinancialYearDeleteView.as_view()),
router.register(r'calendar/holidays', HolidayViewSet, basename='holidays')

# Branch
router.register(r'branches', BranchViewSet, basename='branches')

# Masters & Products
router.register(r'interest-configs', InterestConfigViewSet, basename='interest-configs')
router.register(r'charge-configs', ChargeConfigViewSet, basename='charge-configs')
router.register(r'repayment-configs', RepaymentConfigViewSet, basename='repayment-configs')
router.register(r'risk-rules', RiskRuleViewSet, basename='risk-rules')
router.register(r'scorecards', ScoreCardViewSet, basename='scorecards')
router.register(r'products', TenantLoanProductViewSet, basename='products')

# Tenant CRUD LAST
router.register(r'', TenantViewSet, basename='tenants')

urlpatterns = [
    # Tenant creation
    path("add/", TenantCreateByMasterView.as_view(), name="add-organization"),
    path("signup/", TenantSignupView.as_view(), name="tenant-signup"),

    # Router URLs
    path("", include(router.urls)),

    # Client onboarding
    path("onboarding/", include("tenants.client_onboarding.urls")),

    # ✅ JWT LOGIN (FIXED)
    path("login/", TenantTokenView.as_view(), name="tenant-login"),

    # Tenant list
    path("tenant/", TenantListView.as_view(), name="tenant_list"),
]
