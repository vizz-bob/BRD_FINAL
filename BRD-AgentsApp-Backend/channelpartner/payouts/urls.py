from rest_framework.routers import DefaultRouter
from .views import PayoutViewSet

router = DefaultRouter()
router.register(r'', PayoutViewSet, basename='payouts')

urlpatterns = router.urls
