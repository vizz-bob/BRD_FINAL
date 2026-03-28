from rest_framework.routers import DefaultRouter
from .views import ChannelPartnerViewSet

router = DefaultRouter()
router.register('channel-partners', ChannelPartnerViewSet, basename='channel-partners')

urlpatterns = router.urls
