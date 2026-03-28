from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("stages", DisbursementStageViewSet)
router.register("agencies", DisbursementAgencyViewSet)
router.register("frequencies", DisbursementFrequencyViewSet)
router.register("documents", DisbursementDocumentViewSet)
router.register("down-payments", DownPaymentViewSet)
router.register("third-parties", DisbursementThirdPartyViewSet)
router.register("disbursements", DisbursementViewSet)

urlpatterns = router.urls
