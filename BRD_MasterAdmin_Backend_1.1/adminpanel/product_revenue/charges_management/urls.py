from rest_framework.routers import DefaultRouter
from .views import ChargeViewSet

router = DefaultRouter()
router.register(r"charges", ChargeViewSet, basename="charges")

urlpatterns = router.urls
