from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import LeadViewSet, CustomerViewSet, LeadActivityViewSet, BusinessViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet, basename='leads')
router.register(r'customers', CustomerViewSet, basename='customers')
router.register(r'activities', LeadActivityViewSet, basename='activities')
router.register(r'businesses', BusinessViewSet, basename='businesses') 

urlpatterns = [
    path("", include(router.urls)),
]