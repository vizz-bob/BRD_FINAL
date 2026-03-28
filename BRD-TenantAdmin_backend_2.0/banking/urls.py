from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BankingDashboardViewSet

router = DefaultRouter()
# Register the viewset so that /api/v1/banking/mandates/ works
router.register(r'mandates', BankingDashboardViewSet, basename='mandates')

urlpatterns = [
    path('', include(router.urls)),
]