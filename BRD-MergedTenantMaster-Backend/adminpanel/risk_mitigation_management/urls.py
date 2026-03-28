from django.urls import path
from .views import *

urlpatterns = [
    path("risks/", RiskManagementListCreateAPIView.as_view()),
    path("mitigations/", RiskMitigationListCreateAPIView.as_view()),
    path("deviations/", DeviationManagementListCreateAPIView.as_view()),
    path("rcu/", RiskContainmentUnitListCreateAPIView.as_view()),
    path("frauds/", FraudManagementListCreateAPIView.as_view()),
    path("portfolio-limits/", PortfolioLimitListCreateAPIView.as_view()),
    path("default-limits/", DefaultLimitListCreateAPIView.as_view()),
    path("others/", RiskOtherListCreateAPIView.as_view()),
]
