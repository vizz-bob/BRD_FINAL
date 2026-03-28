# system_settings/serializers.py
from rest_framework import serializers
from .models import LoanConfiguration, SystemSecurityConfiguration, NotificationEmailConfiguration

# ----------------------------
# LoanConfiguration Serializer
# ----------------------------
class LoanConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanConfiguration
        fields = [
            "default_interest_rate",
            "max_loan_amount",
            "min_tenure_months",
            "currency_symbol",
        ]

# ----------------------------
# SystemSecurityConfiguration Serializer
# ----------------------------
class SystemSecurityConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSecurityConfiguration
        fields = [
            "password_min_length",
            "session_timeout_minutes",
            "allow_anonymous_signup",
        ]


class NotificationEmailConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationEmailConfiguration
        fields = [
            "notification_email",
            "webhook_secret_key",
        ]