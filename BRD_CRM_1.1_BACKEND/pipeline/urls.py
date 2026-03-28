from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RawLeadViewSet,
    FollowUpViewSet,
    StageOneDashboardAPIView,
    StageOneMetricsAPIView,
    RawLeadPoolAPIView,
    ValidationRulesAPIView,
    CleanRawPoolAPIView,
    SuppressionListAPIView,
    ExportSuppressionListAPIView,
    FollowUpCreateAPIView,
    CompleteAndArchiveAPIView,
    ScheduleMonthView,
    ScheduleDayView,
    ReschedulePendingView,
    ScheduleMeetingView,
    SaveMeetingOutcomeView,
    RescheduleMeetingView,
    CancelMeetingView,
    CreateLoanApplicationView,
    ApplicationTrackingViewSet,
    DisbursedLoanViewSet,
    escalation_dashboard,
    notify_agent,
    reassign_lead,
    MeetingViewSet,
    LoanApplicationViewSet,
    LeadStatusDashboard,
    LeadLostViewSet,
    LeadDeadViewSet,
    LeadExpiredViewSet,
    LeadRejectedViewSet,
    ListEscalations,
    followup_stats,
    deals_stats
)

urlpatterns = [
    # Stage 1 Dashboard - Main overview
    path("stage-1/dashboard/", StageOneDashboardAPIView.as_view(), name="stage-one-dashboard"),
   
    # Stage 1 metrics (legacy endpoint)
    path("stage-1/metrics/", StageOneMetricsAPIView.as_view(), name="stage-one-metrics"),
   
    # Raw lead pool
    path("stage-1/raw-leads/", RawLeadPoolAPIView.as_view(), name="raw-lead-pool"),
   
    # Validation rules
    path("validation-rules/", ValidationRulesAPIView.as_view(), name="validation-rules"),
    path("validation-rules/clean-pool/", CleanRawPoolAPIView.as_view(), name="clean-raw-pool"),
   
    # Suppression list
    path("suppression-list/", SuppressionListAPIView.as_view(), name="suppression-list"),
    path("suppression-list/<int:suppression_id>/", SuppressionListAPIView.as_view(), name="suppression-detail"),
    path("suppression-list/export/", ExportSuppressionListAPIView.as_view(), name="export-suppression"),
    path('follow-up/create/', FollowUpCreateAPIView.as_view()),
    path('follow-up/<int:pk>/complete-archive/', CompleteAndArchiveAPIView.as_view()),
    path('schedule/month/', ScheduleMonthView.as_view()),
    path('schedule/day/', ScheduleDayView.as_view()),
    path('schedule/reschedule/', ReschedulePendingView.as_view()),
    path("schedule-meeting/", ScheduleMeetingView.as_view()),
    path("save-outcome/", SaveMeetingOutcomeView.as_view()),
    path("reschedule-meeting/<str:meeting_id>/",
         RescheduleMeetingView.as_view()),
    path("cancel-meeting/<str:meeting_id>/",
         CancelMeetingView.as_view()),
    path("loan-application/", CreateLoanApplicationView.as_view()),
    path("escalation-dashboard/", escalation_dashboard),
    path("notify-agent/<int:escalation_id>/", notify_agent),
    path("reassign/<int:escalation_id>/", reassign_lead),
    path("lead-status-dashboard/", LeadStatusDashboard),
    path("follow-ups/stats/", followup_stats),
    path("deals/stats/", deals_stats),
]


router = DefaultRouter()
router.register("raw-leads", RawLeadViewSet, basename="raw-leads")
router.register("follow-ups", FollowUpViewSet, basename="follow-ups")
router.register("application-tracking", ApplicationTrackingViewSet)
router.register("disbursed-loans", DisbursedLoanViewSet)
router.register("meetings", MeetingViewSet, basename="meetings")
router.register("loan-applications", LoanApplicationViewSet, basename="loan-applications")
router.register("lead-lost", LeadLostViewSet, basename="lead-lost")
router.register("lead-dead", LeadDeadViewSet, basename="lead-dead")
router.register("lead-expired", LeadExpiredViewSet, basename="lead-expired")
router.register("lead-rejected", LeadRejectedViewSet, basename="lead-rejected")
router.register("escalations-list", ListEscalations, basename="escalations-list")
urlpatterns = urlpatterns + router.urls
