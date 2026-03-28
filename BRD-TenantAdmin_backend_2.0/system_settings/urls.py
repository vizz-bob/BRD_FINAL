from django.urls import path
from .views import (
    SystemSecurityConfigurationView,
    NotificationEmailConfigurationView,
    LoanConfigurationView,
)

urlpatterns = [
    path("system-security/", SystemSecurityConfigurationView.as_view()),
    path("notifications-email/", NotificationEmailConfigurationView.as_view()),
    path("loan-configuration/", LoanConfigurationView.as_view()),  # ✅ FIXED
]
