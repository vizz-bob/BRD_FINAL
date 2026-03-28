from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RuleIdentificationViewSet,
    ClientProfileRuleViewSet,
    FinancialEligibilityRuleViewSet,
    CollateralQualityRuleViewSet,
    AutomatedScorecardViewSet,
    AgencyVerificationRuleViewSet
)

router = DefaultRouter()

router.register(r'rule-identification', RuleIdentificationViewSet)
router.register(r'client-profile-rules', ClientProfileRuleViewSet)
router.register(r'financial-eligibility-rules', FinancialEligibilityRuleViewSet)
router.register(r'collateral-quality-rules', CollateralQualityRuleViewSet)
router.register(r'automated-scorecards', AutomatedScorecardViewSet)
router.register(r'agency-verification-rules', AgencyVerificationRuleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]