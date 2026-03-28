from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'tenants', views.TenantViewSet, basename='tenant')
router.register(r'settings', views.SettingViewSet, basename='setting')
router.register(r'dashboards', views.DashboardViewSet, basename='dashboard')
router.register(r'disbursements', views.DisbursementViewSet, basename='disbursement')
router.register(r'reconciliation', views.ReconciliationTransactionViewSet, basename='reconciliation')
router.register(r'repayments', views.RepaymentViewSet, basename='repayment')
router.register(r'payment-records', views.PaymentRecordViewSet, basename='payment-record')
router.register(r'reminders', views.ReminderViewSet, basename='reminder')

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Legacy endpoints for backward compatibility
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('disbursement/dashboard/', views.DisbursementDashboardView.as_view(), name='disbursement_dashboard'),
    path('reconciliation/list', views.ReconciliationListView.as_view(), name='reconciliation_list'),
    path('reconciliation/bulk-update', views.ReconciliationListView.as_view(), name='reconciliation_bulk_update'),
    path('repayments/list', views.RepaymentListView.as_view(), name='repayment_list'),
    path('repayments/<str:repayment_id>/record', views.RecordPaymentView.as_view(), name='record_payment'),
    path('repayments/<str:repayment_id>/send-reminder', views.SendReminderView.as_view(), name='send_reminder'),
    path('report/generate', views.GenerateReportView.as_view(), name='generate_report'),
    path('reports/', views.ListReportsView.as_view(), name='list_reports'),
    path('repayments/report/download', views.DownloadRepaymentsReportView.as_view(), name='download_repayments_report'),
    path('disbursements/report/download', views.DownloadDisbursementsReportView.as_view(), name='download_disbursements_report'),
]
