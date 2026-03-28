# system_settings/models.py
from django.db import models
from tenants.models import Tenant


# ----------------------------
# LoanConfiguration Model
# ----------------------------
class LoanConfiguration(models.Model):
    default_interest_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        help_text="Default loan interest rate (e.g. 0.12)"
    )
    max_loan_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        help_text="Maximum loan amount"
    )
    min_tenure_months = models.PositiveIntegerField(
        help_text="Minimum loan tenure in months"
    )
    currency_symbol = models.CharField(
        max_length=5,
        default="₹"
    )

    def __str__(self):
        return "Loan Configuration"

# ----------------------------
# System Security Configuration
# ----------------------------
class SystemSecurityConfiguration(models.Model):
    password_min_length = models.PositiveIntegerField(default=8)
    session_timeout_minutes = models.PositiveIntegerField(default=30)
    allow_anonymous_signup = models.BooleanField(default=False)

    def __str__(self):
        return "System Security Configuration"


# ----------------------------
# Notification Email Configuration
# ----------------------------
class NotificationEmailConfiguration(models.Model):
    notification_email = models.EmailField(default="no-reply@platform.com")
    webhook_secret_key = models.CharField(max_length=255)

    def __str__(self):
        return "Notification & Email Configuration"
