from rest_framework.routers import DefaultRouter
from .views import ProductMixViewSet

router = DefaultRouter()
router.register(r"product-mixes", ProductMixViewSet, basename="product-mixes")

urlpatterns = router.urls
