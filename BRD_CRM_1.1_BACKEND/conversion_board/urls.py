from django.urls import path
from .views import (
    LeadListView, 
    LeadUpdateView, 
    HotLeadsStatsView, 
    HotLeadKanbanView,
    UpdateLeadStatusView,
    MoveToDealView,
    MarkAsDormantView,
    ExportLeadsCSV
)

urlpatterns = [
    path("leads/", LeadListView.as_view(), name="lead-list"),
    path("leads/<int:id>/update/", LeadUpdateView.as_view(), name="lead-update"),
    path("leads/stats/", HotLeadsStatsView.as_view(), name="hot-leads-stats"),
    path("leads/kanban/", HotLeadKanbanView.as_view(), name="hot-lead-kanban"),
    path("leads/<int:id>/update-status/", UpdateLeadStatusView.as_view(), name="update-lead-status"),
    path("leads/<int:id>/qualified/", MoveToDealView.as_view(), name="move-to-deal"),
    path("leads/<int:id>/dormant/", MarkAsDormantView.as_view(), name="mark-as-dormant"),
    path("leads/export/", ExportLeadsCSV.as_view(), name="lead-export"),
]
