from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import IncentiveViewSet

router = DefaultRouter()
router.register(r'incentives', IncentiveViewSet, basename='incentives')

urlpatterns = router.urls