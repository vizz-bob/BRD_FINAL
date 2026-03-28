from rest_framework.routers import DefaultRouter
from .views import ResourceViewSet, ResourceCategoryViewSet

router = DefaultRouter()
router.register(r"resources", ResourceViewSet)
router.register(r"resource-categories", ResourceCategoryViewSet)

urlpatterns = router.urls