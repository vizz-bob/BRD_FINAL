from django.urls import path
from .views import (
    DashboardSummaryAPIView,
    DashboardActivityAPIView,
    DashboardAlertAPIView,
    DisbursementTrendAPIView,
)

urlpatterns = [
    path("summary/", DashboardSummaryAPIView.as_view()),
    path("activity/", DashboardActivityAPIView.as_view()),
    path("alerts/", DashboardAlertAPIView.as_view()),
    path("disbursement-trends/", DisbursementTrendAPIView.as_view()),
]
