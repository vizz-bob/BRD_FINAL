from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import  LoanLedgerViewSet,RepaymentViewSet,CollectionBucketViewSet,PromiseToPayViewSet,InteractionLogViewSet,RecoveryCaseViewSet, ForecastViewSet,TargetViewSet,ActivityTargetViewSet,ConversionTargetViewSet,FinancialTargetViewSet,CampaignROIViewSet,TargetHistoryViewSet

router = DefaultRouter()
router.register("loans", LoanLedgerViewSet)
router.register("repayments", RepaymentViewSet)
router.register("collections", CollectionBucketViewSet)
router.register("ptp", PromiseToPayViewSet)
router.register("interactions", InteractionLogViewSet)
router.register("recovery", RecoveryCaseViewSet)
router.register("forecasts", ForecastViewSet, basename="forecast")
router.register("targets", TargetViewSet)
router.register("activity-targets", ActivityTargetViewSet)
router.register("conversion-targets", ConversionTargetViewSet)
router.register("financial-targets", FinancialTargetViewSet, basename="financial")
router.register("campaign-roi", CampaignROIViewSet)
router.register("target-history", TargetHistoryViewSet)

urlpatterns = router.urls

