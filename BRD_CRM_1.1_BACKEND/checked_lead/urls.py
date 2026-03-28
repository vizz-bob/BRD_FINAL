# checked_lead/urls.py
from django.urls import path
from .views import CheckedLeadListView, CheckedLeadUpdateView, move_to_qualified, mark_lead_dead, CheckedLeadKanbanView

urlpatterns = [
    path('', CheckedLeadListView.as_view(), name='checked-lead-list'),
    # add other paths
]
