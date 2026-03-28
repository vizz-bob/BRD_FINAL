from rest_framework import viewsets
from .models import (
    ScheduleVerification,
    AssignAgent,
    FieldVerification,
    FieldDashboard,
)
from .serializers import (
    ScheduleVerificationSerializer,
    AssignAgentSerializer,
    FieldVerificationSerializer,
    FieldDashboardSerializer,
)


class ScheduleVerificationViewSet(viewsets.ModelViewSet):
    queryset = ScheduleVerification.objects.all().order_by("-created_at")
    serializer_class = ScheduleVerificationSerializer


class AssignAgentViewSet(viewsets.ModelViewSet):
    queryset = AssignAgent.objects.all().order_by("-created_at")
    serializer_class = AssignAgentSerializer


class FieldVerificationViewSet(viewsets.ModelViewSet):
    queryset = FieldVerification.objects.all().order_by("-created_at")
    serializer_class = FieldVerificationSerializer


class FieldDashboardViewSet(viewsets.ModelViewSet):
    queryset = FieldDashboard.objects.all().order_by("-created_at")
    serializer_class = FieldDashboardSerializer