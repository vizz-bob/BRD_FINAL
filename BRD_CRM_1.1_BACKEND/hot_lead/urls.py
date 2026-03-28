from django.urls import path
from .views import (
    HotLeadListView,
    HotLeadUpdateView,
    MoveToQualifiedView,
    MarkLeadDeadView,
    HotLeadKanbanView,
    UpdateLeadStatusView,
    PriorityListView,
    ExportHotLeadsCSV,
)

urlpatterns = [
    # 🔹 List All Leads (High Potential Queue)
    path("hot-leads/", HotLeadListView.as_view(), name="hot-lead-list"),

    # 🔹 Export All Leads
    path("hot-leads/export/", ExportHotLeadsCSV.as_view(), name="hot-lead-export"),

    # 🔹 General Update
    path("hot-leads/<int:pk>/update/", HotLeadUpdateView.as_view(), name="hot-lead-update"),

    # 🔹 Move to Qualified
    path("hot-leads/<int:pk>/qualified/", MoveToQualifiedView.as_view(), name="move-to-qualified"),

    # 🔹 Mark as Dead / Dormant
    path("hot-leads/<int:pk>/dead/", MarkLeadDeadView.as_view(), name="mark-lead-dead"),

    # 🔹 Kanban / Conversion Board (Grouped by Status)
    path("hot-leads/kanban/", HotLeadKanbanView.as_view(), name="hot-lead-kanban"),

    # 🔹 Drag & Drop Status Update (Conversion Board API)
    path("hot-leads/<int:pk>/update-status/", UpdateLeadStatusView.as_view(), name="update-lead-status"),

    # 🔹 Priority List (High → Medium → Low)
    path("hot-leads/priority-list/", PriorityListView.as_view(), name="priority-list"),
]
