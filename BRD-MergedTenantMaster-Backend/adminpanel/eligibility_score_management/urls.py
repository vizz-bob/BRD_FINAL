from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("eligibility", EligibilityManagementViewSet)
router.register("banking", BankingManagementViewSet)
router.register("obligations", ExistingObligationManagementViewSet)
router.register("score-cards", ScoreCardManagementViewSet)

urlpatterns = router.urls
