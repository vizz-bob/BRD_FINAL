# manage_tenants/urls.py
from django.urls import path
from .views import (
    DashboardListCreateView, DashboardDetailView,
    TenantListCreateView, TenantDetailView,
    ShowTenantListCreateView, ShowTenantDetailView,
)

urlpatterns = [
    # Dashboard  →  /manage/
    path("", DashboardListCreateView.as_view(), name="dashboard-list-create"),
    path("<int:pk>/", DashboardDetailView.as_view(), name="dashboard-detail"),

    # Add Tenant  →  /manage/tenant/
    path("tenant/", TenantListCreateView.as_view(), name="tenant-list-create"),
    path("tenant/<int:pk>/", TenantDetailView.as_view(), name="tenant-detail"),

    # Show Tenant  →  /manage/show-tenant/
    path("show-tenant/", ShowTenantListCreateView.as_view(), name="show-tenant-list-create"),
    path("show-tenant/<int:pk>/", ShowTenantDetailView.as_view(), name="show-tenant-detail"),
]