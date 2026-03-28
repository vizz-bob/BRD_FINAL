from rest_framework.routers import DefaultRouter
from .views import InterestConfigurationViewSet

router = DefaultRouter()
router.register(r"interest", InterestConfigurationViewSet, basename="interest")

urlpatterns = router.urls
