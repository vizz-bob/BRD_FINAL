from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    RuleMasterViewSet,
    ImpactValueViewSet,
    ClientProfileRuleViewSet,
    FinancialEligibilityRuleViewSet,
    CollateralQualityRuleViewSet,
    CreditHistoryRuleViewSet,
    InternalScoreRuleViewSet,
    GeoLocationRuleViewSet,
    RiskMitigationRuleViewSet,
    InternalVerificationRuleViewSet,
    AgencyVerificationRuleViewSet,
    TenantRulesView,
    DebugDataView,
)

router = DefaultRouter()

# Rule Master & Impact Values
router.register("rule-master",    RuleMasterViewSet,   basename="rule-master")
router.register("impact-values",  ImpactValueViewSet,  basename="impact-values")

# Client Profile
router.register("client-profile", ClientProfileRuleViewSet, basename="client-profile")

# Financial Eligibility
router.register("financial-eligibility", FinancialEligibilityRuleViewSet, basename="financial-eligibility")

# Collateral Quality
router.register("collateral-quality", CollateralQualityRuleViewSet, basename="collateral-quality")

# Scorecard sub-modules
router.register("credit-history",  CreditHistoryRuleViewSet,   basename="credit-history")
router.register("internal-score",  InternalScoreRuleViewSet,   basename="internal-score")
router.register("geo-location",    GeoLocationRuleViewSet,     basename="geo-location")

# Risk Mitigation
router.register("risk-mitigation", RiskMitigationRuleViewSet,  basename="risk-mitigation")

# Verification
router.register("internal-verification", InternalVerificationRuleViewSet, basename="internal-verification")
router.register("agency-verification",   AgencyVerificationRuleViewSet,  basename="agency-verification")

urlpatterns = [
    # Debug endpoint for testing
    path("debug/", DebugDataView.as_view()),
    
    # Tenant config blob endpoints (used by Rules.jsx)
    path("tenant/<str:tenant_id>/", TenantRulesView.as_view()),
    path("",                        TenantRulesView.as_view()),
    # All rule-management sub-module endpoints
    path("", include(router.urls)),
]
