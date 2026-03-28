from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("banks", BankViewSet)
router.register("fund-types", FundTypeViewSet)
router.register("funds", FundViewSet)
router.register("portfolios", PortfolioViewSet)
router.register("modes-of-bank", ModeOfBankViewSet)
router.register("taxes", TaxViewSet)
router.register("business-models", BusinessModelViewSet)

urlpatterns = router.urls
