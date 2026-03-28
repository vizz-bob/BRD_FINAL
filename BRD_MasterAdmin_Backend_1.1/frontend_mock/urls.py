from django.urls import path
from .views import DashboardFullView
from .views import DashboardFullView, LoansListView, TenantsListView, IntegrationsListView, LogsListView


urlpatterns = [
    path('dashboard/full', DashboardFullView.as_view(), name='dashboard-full'),
    path('dashboard/full', DashboardFullView.as_view(), name='dashboard-full'),
    path('loans', LoansListView.as_view(), name='loans-list'),
    path('tenants', TenantsListView.as_view(), name='tenants-list'),
    path('integrations', IntegrationsListView.as_view(), name='integrations-list'),
    path('logs/audit', LogsListView.as_view(), name='logs-audit'),
]
