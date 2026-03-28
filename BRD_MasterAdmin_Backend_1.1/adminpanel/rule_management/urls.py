from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("rule-master", RuleMasterView)
router.register("impact-values", ImpactValueView)
router.register("client-profile", ClientProfileRuleView)
router.register("collateral-quality", CollateralQualityRuleView)
router.register("financial-eligibility", FinancialEligibilityRuleView)
router.register("credit-history", CreditHistoryRuleView)
router.register("internal-score", InternalScoreRuleView)
router.register("geo-location", GeoLocationRuleView)
router.register("risk-mitigation", RiskMitigationRuleView)
router.register("internal-verification", InternalVerificationRuleView)
router.register("agency-verification", AgencyVerificationRuleView)

urlpatterns = router.urls
