from django.urls import path
from .views import (
    PropertyCheckCreateListView,
    PropertyCheckDetailView,
    PropertyDashboardListCreateView,
    PropertyDashboardDetailView,
)

urlpatterns = [
    path("property-checks/", PropertyCheckCreateListView.as_view(), name="property-check-list-create"),
    path("property-checks/<int:pk>/", PropertyCheckDetailView.as_view(), name="property-check-detail"),
    path("dashboard/", PropertyDashboardListCreateView.as_view(), name="dashboard-list"),
    path("dashboard/<int:pk>/", PropertyDashboardDetailView.as_view(), name="dashboard-detail"),
]