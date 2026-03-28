from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorProfileViewSet, AgentProfileViewSet, ClientProfileViewSet

router = DefaultRouter()
router.register("vendors", VendorProfileViewSet)
router.register("agents", AgentProfileViewSet)
router.register("clients", ClientProfileViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
