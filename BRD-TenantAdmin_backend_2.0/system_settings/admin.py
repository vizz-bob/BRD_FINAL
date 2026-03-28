# system_settings/admin.py
from django.contrib import admin
from .models import (
    LoanConfiguration,
    SystemSecurityConfiguration,
    NotificationEmailConfiguration,
)

# ----------------------------
# Loan Configuration
# ----------------------------
@admin.register(LoanConfiguration)
class LoanConfigurationAdmin(admin.ModelAdmin):
    list_display = (
        "default_interest_rate",
        "max_loan_amount",
        "min_tenure_months",
        "currency_symbol",
    )


# ----------------------------
# System Security Configuration
# ----------------------------
@admin.register(SystemSecurityConfiguration)
class SystemSecurityConfigurationAdmin(admin.ModelAdmin):
    list_display = (
        "password_min_length",
        "session_timeout_minutes",
        "allow_anonymous_signup",
    )


# ----------------------------
# Notification Email Configuration
# ----------------------------
@admin.register(NotificationEmailConfiguration)
class NotificationEmailConfigurationAdmin(admin.ModelAdmin):
    list_display = (
        "notification_email",
        "webhook_secret_key",
    )
