from django.urls import path
from .views import (
    NewOfferListCreateView,
    NewOfferDetailView,
    NewTargettingListCreateView,
    NewTargettingDetailView,
    DashboardListCreateView,
    DashboardDetailView,
)

urlpatterns = [
    path("", NewOfferListCreateView.as_view(), name="offer-list-create"),
    path("<int:pk>/", NewOfferDetailView.as_view(), name="offer-detail"),

    path("targetting/", NewTargettingListCreateView.as_view(), name="targetting-list-create"),
    path("targetting/<int:pk>/", NewTargettingDetailView.as_view(), name="targetting-detail"),

    path("dashboard/", DashboardListCreateView.as_view(), name="dashboard-list-create"),
    path("dashboard/<int:pk>/", DashboardDetailView.as_view(), name="dashboard-detail"),
]