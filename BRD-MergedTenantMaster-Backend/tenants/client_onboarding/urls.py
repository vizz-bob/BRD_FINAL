from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet

router = DefaultRouter()
router.register("clients", ClientViewSet, basename="clients")

urlpatterns = [
    # 👇 Signup ke liye ye path zaroori hai
    path("register/", ClientViewSet.as_view({'post': 'create'}), name="client-register"),
    
    # Baaki router URLs (jaise /clients/)
    path("", include(router.urls)),
]