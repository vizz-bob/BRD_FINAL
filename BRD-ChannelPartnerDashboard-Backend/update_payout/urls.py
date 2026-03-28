from django.urls import path
from .views import (
    PayoutDashboardListCreateView,
    PayoutDashboardDetailView,
    PayoutSearchListCreateView,
    PayoutSearchDetailView,
    PayoutAgentListCreateView,
    PayoutAgentDetailView,
)

urlpatterns = [
    # Dashboard
    path("", PayoutDashboardListCreateView.as_view(), name="payout-dashboard-list-create"),
    path("<int:pk>/", PayoutDashboardDetailView.as_view(), name="payout-dashboard-detail"),

    # Search
    path("search/", PayoutSearchListCreateView.as_view(), name="payout-search-list-create"),
    path("search/<int:pk>/", PayoutSearchDetailView.as_view(), name="payout-search-detail"),

    # Agents
    path("agents/", PayoutAgentListCreateView.as_view(), name="payout-agent-list-create"),
    path("agents/<int:pk>/", PayoutAgentDetailView.as_view(), name="payout-agent-detail"),
]