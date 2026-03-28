from rest_framework.routers import DefaultRouter
from .views import RepaymentConfigurationViewSet

router = DefaultRouter()
router.register(r"repayments", RepaymentConfigurationViewSet, basename="repayments")

urlpatterns = router.urls
