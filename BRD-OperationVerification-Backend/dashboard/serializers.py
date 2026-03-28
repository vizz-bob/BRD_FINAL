from rest_framework import serializers
from .models import OperationsDashboard, PendingTask, SLABreachAlert


class OperationsDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationsDashboard
        fields = [
            "id",
            "pending_tasks",
            "completed_today",
            "sla_breaches",
            "ocr_failures",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

class SLABreachAlertSerializer(serializers.ModelSerializer):

    overdue_hours = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = SLABreachAlert
        fields = "__all__"

    def get_overdue_hours(self, obj):
        return obj.overdue_hours()

    def get_is_overdue(self, obj):
        return obj.is_overdue()


class PendingTaskSerializer(serializers.ModelSerializer):
    # tat_remaining is a @property, so declare it as a read-only field
    tat_remaining = serializers.SerializerMethodField()

    class Meta:
        model = PendingTask
        fields = [
            "id",
            "task_id",
            "type",
            "customer",
            "priority",
            "due_date",
            "action",
            "tat_remaining",
        ]
        read_only_fields = ["id", "task_id", "tat_remaining"]

    def get_tat_remaining(self, obj):
        # Safely call the property — returns None if due_date is missing
        try:
            return obj.tat_remaining
        except Exception:
            return None
