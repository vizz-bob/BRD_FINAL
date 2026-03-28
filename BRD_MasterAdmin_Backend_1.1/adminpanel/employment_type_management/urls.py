from rest_framework.routers import DefaultRouter
from .views import EmploymentTypeMasterViewSet

router = DefaultRouter()
router.register("employment-types", EmploymentTypeMasterViewSet, basename="employment-type")

urlpatterns = router.urls
