from django.urls import path
from .views import (
    DashboardListCreateView,
    DashboardDetailView,
    TemplateListCreateView,
    TemplateDetailView,
)

urlpatterns = [
    # Template → /performance/
    path("", TemplateListCreateView.as_view(), name="template-list-create"),
    path("<int:pk>/", TemplateDetailView.as_view(), name="template-detail"),

    # Dashboard → /performance/dashboard/
    path("dashboard/", DashboardListCreateView.as_view(), name="dashboard-list"),
    path("dashboard/<int:pk>/", DashboardDetailView.as_view(), name="dashboard-detail"),
]