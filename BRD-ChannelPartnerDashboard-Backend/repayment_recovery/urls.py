#-----------------------------
# add record
#-----------------------------
from django.urls import path
from .views import (
    RecoveryRecordListCreateView,
    RecoveryRecordDetailView,
    DashboardListCreateView,
    DashboardDetailView,
    RecoverySearchListCreateView,
    RecoverySearchDetailView,
     EditRecoveryListCreateView,
    EditRecoveryDetailView,
)

urlpatterns = [
    path("", RecoveryRecordListCreateView.as_view(), name="recovery-record-list-create"),
    path("<int:pk>/", RecoveryRecordDetailView.as_view(), name="recovery-record-detail"),
    path("dashboard/", DashboardListCreateView.as_view(), name="dashboard-list-create"),
    path("dashboard/<int:pk>/", DashboardDetailView.as_view(), name="dashboard-detail"),
    path("recovery-search/", RecoverySearchListCreateView.as_view(), name="recovery-search-list-create"),
    path("recovery-search/<int:pk>/", RecoverySearchDetailView.as_view(), name="recovery-search-detail"),
    path("edit-recovery/", EditRecoveryListCreateView.as_view(), name="edit-recovery-list-create"),
    path("edit-recovery/<int:pk>/", EditRecoveryDetailView.as_view(), name="edit-recovery-detail"),
]