from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EscalationRuleViewSet

router = DefaultRouter()
router.register('rules', EscalationRuleViewSet, basename='escalation-rules')

urlpatterns = [
    path('', include(router.urls)),
]
