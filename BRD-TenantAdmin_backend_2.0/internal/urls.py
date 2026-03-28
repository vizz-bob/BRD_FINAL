from django.urls import path
from .views import (
    DashboardListView,
    MyDashboardsView,
    MyRolesView,
)

urlpatterns = [
    path("dashboards/", DashboardListView.as_view()),
    path("my-dashboards/", MyDashboardsView.as_view()),
    path("my-roles/", MyRolesView.as_view()),
]
