from rest_framework import serializers
from .models import (
    ScheduleVerification,
    AssignAgent,
    FieldVerification,
    FieldDashboard,
)


class ScheduleVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleVerification
        fields = "__all__"


class AssignAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignAgent
        fields = "__all__"


class FieldVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldVerification
        fields = "__all__"


class FieldDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldDashboard
        fields = "__all__"