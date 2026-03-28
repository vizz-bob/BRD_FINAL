from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardViewSet,
    LeadViewSet,
    ReminderViewSet,
    NotificationViewSet,
    TeamMemberViewSet,
    ResourceViewSet,
    ResourceViewSet,
)

router = DefaultRouter()
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'team', TeamMemberViewSet, basename='team')
router.register(r'resources', ResourceViewSet, basename='resource')

urlpatterns = [
    path('api/', include(router.urls)),
]