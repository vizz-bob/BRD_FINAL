from rest_framework.routers import DefaultRouter
from .views import ComplianceCheckViewSet, RiskFlagViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('checks', ComplianceCheckViewSet, basename='check')
router.register('flags', RiskFlagViewSet, basename='flag')

urlpatterns = [
    path('', include(router.urls)),
]
