from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, BranchViewSet

router = DefaultRouter()
router.register(r"organizations", OrganizationViewSet, basename="organizations")
router.register(r"branches", BranchViewSet, basename="branches")

urlpatterns = router.urls
