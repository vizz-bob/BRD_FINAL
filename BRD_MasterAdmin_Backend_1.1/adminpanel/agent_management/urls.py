from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("channel-partners", ChannelPartnerViewSet)
router.register("verification-agencies", VerificationAgencyViewSet)
router.register("collection-agents", CollectionAgentViewSet)

urlpatterns = router.urls
