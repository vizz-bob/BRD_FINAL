from rest_framework.routers import DefaultRouter
from .views import OccupationTypeMasterViewSet

router = DefaultRouter()
router.register("occupation-types", OccupationTypeMasterViewSet, basename="occupation-type")

urlpatterns = router.urls
