from django.urls import path
from .views import DashboardStatsView
from .views import HomeDashboardView

urlpatterns = [
    path('', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats-alt'),
    path('recent-leads/', DashboardStatsView.as_view(), name='dashboard-recent-leads'),
    path('home/', HomeDashboardView.as_view(), name='home-dashboard'),
]

