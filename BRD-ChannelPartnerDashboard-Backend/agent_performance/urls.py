# agent_performance/urls.py

from django.urls import path
from .views import (
    NewAgentListCreateView, NewAgentDetailView,
    DashboardListCreateView, DashboardDetailView,
    AllAgentListCreateView, AllAgentDetailView,
    EditAgentListCreateView, EditAgentDetailView,
    ViewAgentListCreateView, ViewAgentDetailView,
    RemoveAgentView,
)

urlpatterns = [
    # New Agent
    path('', NewAgentListCreateView.as_view(), name='new-agent-list-create'),
    path('<int:pk>/', NewAgentDetailView.as_view(), name='new-agent-detail'),

    # Dashboard
    path('dashboard/', DashboardListCreateView.as_view(), name='dashboard-list-create'),
    path('dashboard/<int:pk>/', DashboardDetailView.as_view(), name='dashboard-detail'),

    # All Agent
    path('all-agent/', AllAgentListCreateView.as_view(), name='all-agent-list-create'),
    path('all-agent/<int:pk>/', AllAgentDetailView.as_view(), name='all-agent-detail'),

    # Edit Agent
    path('edit-agent/', EditAgentListCreateView.as_view(), name='edit-agent-list-create'),
    path('edit-agent/<int:pk>/', EditAgentDetailView.as_view(), name='edit-agent-detail'),

    # View Agent
    path('view-agent/', ViewAgentListCreateView.as_view(), name='view-agent-list'),
    path('view-agent/<int:pk>/', ViewAgentDetailView.as_view(), name='view-agent-detail'),

    # Remove Agent
    path('remove-agent/', RemoveAgentView.as_view(), name='remove-agent'),
]