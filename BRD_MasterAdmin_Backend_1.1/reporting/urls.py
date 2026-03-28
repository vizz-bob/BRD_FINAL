from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReportViewSet, AnalyticsViewSet, DashboardStatsView,
    DailyDisbursementReportView, BranchPerformanceReportView,
    LoanApprovalReportView, NPAReportView, RevenueReportView, UserActivityReportView
)

router = DefaultRouter()
router.register('reports', ReportViewSet, basename='report')
router.register('analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    # ✅ Custom Endpoints ko Router se PEHLE rakhein
    path('dashboard/full', DashboardStatsView.as_view(), name='dashboard-full'),
    
    path('reports/daily-disbursement/', DailyDisbursementReportView.as_view(), name='daily-disbursement'),
    path('reports/branch-performance/', BranchPerformanceReportView.as_view(), name='branch-performance'),
    path('reports/loan-approval/', LoanApprovalReportView.as_view(), name='loan-approval'),
    path('reports/npa/', NPAReportView.as_view(), name='npa-report'),
    path('reports/revenue/', RevenueReportView.as_view(), name='revenue-report'),
    path('reports/user-activity/', UserActivityReportView.as_view(), name='user-activity'),

    # ✅ Generic Router URLs (ab ye bachi hui requests handle karega)
    path('', include(router.urls)),
]