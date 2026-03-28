from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import APIIntegrationViewSet, WebhookLogViewSet

router = DefaultRouter()
router.register(r'', APIIntegrationViewSet, basename='integrations')
router.register(r'webhook-logs', WebhookLogViewSet, basename='webhooklogs')

urlpatterns = [
    path("", include(router.urls)),
]
