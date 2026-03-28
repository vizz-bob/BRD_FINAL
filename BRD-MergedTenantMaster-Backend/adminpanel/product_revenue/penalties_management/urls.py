from rest_framework.routers import DefaultRouter
from .views import PenaltyViewSet

router = DefaultRouter()
router.register(r"penalties", PenaltyViewSet, basename="penalties")

urlpatterns = router.urls
