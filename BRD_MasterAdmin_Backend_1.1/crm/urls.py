from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import LeadViewSet, CustomerViewSet, LeadActivityViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='leads')
router.register(r'customers', CustomerViewSet, basename='customers')
router.register(r'activities', LeadActivityViewSet, basename='activities')

urlpatterns = [
    path("", include(router.urls)),
]
