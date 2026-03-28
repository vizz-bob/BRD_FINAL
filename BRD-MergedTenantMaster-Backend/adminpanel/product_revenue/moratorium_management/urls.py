from rest_framework.routers import DefaultRouter
from .views import MoratoriumViewSet

router = DefaultRouter()
router.register(r"moratoriums", MoratoriumViewSet, basename="moratoriums")

urlpatterns = router.urls
