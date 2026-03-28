# system_settings/views.py
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import LoanConfiguration, SystemSecurityConfiguration, NotificationEmailConfiguration
from .serializers import (
    LoanConfigurationSerializer,
    SystemSecurityConfigurationSerializer,
    NotificationEmailConfigurationSerializer
)
from .permissions import IsTenantAdmin


# ----------------------------
# LoanConfiguration View
# ----------------------------
class LoanConfigurationView(RetrieveUpdateAPIView):
    serializer_class = LoanConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Singleton pattern
        obj, created = LoanConfiguration.objects.get_or_create(
            id=1,
            defaults={
                "default_interest_rate": 0.12,
                "max_loan_amount": 1000000,
                "min_tenure_months": 6,
                "currency_symbol": "₹",
            }
        )
        return obj


# ----------------------------
# System Security View
# ----------------------------
class SystemSecurityConfigurationView(RetrieveUpdateAPIView):
    serializer_class = SystemSecurityConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Only one configuration instance
        obj, created = SystemSecurityConfiguration.objects.get_or_create(id=1)
        return obj


# ----------------------------
# Notification Email View
# ----------------------------
class NotificationEmailConfigurationView(RetrieveUpdateAPIView):
    serializer_class = NotificationEmailConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Only one configuration instance
        obj, created = NotificationEmailConfiguration.objects.get_or_create(id=1)
        return obj