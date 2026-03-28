# dashboard/urls.py
from django.urls import path
from .views import (
    DashboardListCreateView, DashboardDetailView,
    RecentAgentListCreateView, RecentAgentDetailView,
)

urlpatterns = [
    # Dashboard
    path('dashboard/', DashboardListCreateView.as_view(), name='dashboard-list-create'),
    path('dashboard/<int:pk>/', DashboardDetailView.as_view(), name='dashboard-detail'),

    # Recent Agents
    path('recent-agents/', RecentAgentListCreateView.as_view(), name='recent-agent-list-create'),
    path('recent-agents/<int:pk>/', RecentAgentDetailView.as_view(), name='recent-agent-detail'),
]