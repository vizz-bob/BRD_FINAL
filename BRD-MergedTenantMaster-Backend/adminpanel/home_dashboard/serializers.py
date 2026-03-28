from rest_framework import serializers
from .models import DashboardActivity, DashboardAlert


class DashboardSummarySerializer(serializers.Serializer):
    total_organizations = serializers.IntegerField()
    total_branches = serializers.IntegerField()
    active_users = serializers.IntegerField()
    active_loans = serializers.IntegerField()
    daily_disbursement = serializers.DecimalField(max_digits=12, decimal_places=2)
    api_status = serializers.CharField()


class DashboardActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardActivity
        fields = "__all__"


class DashboardAlertSerializer(serializers.Serializer):
    critical = serializers.IntegerField()
    warning = serializers.IntegerField()
    info = serializers.IntegerField()
