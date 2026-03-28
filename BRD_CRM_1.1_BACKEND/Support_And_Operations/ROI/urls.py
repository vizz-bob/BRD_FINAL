# ROI/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChannelViewSet, ChannelAnalyticsViewSet, ChannelDashboardViewSet

router = DefaultRouter()
router.register(r'channels', ChannelViewSet, basename='channels')
router.register(r'channel-analytics', ChannelAnalyticsViewSet, basename='channel-analytics')
router.register(r'channel-dashboard', ChannelDashboardViewSet, basename='channel-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
