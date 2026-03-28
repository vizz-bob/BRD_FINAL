from rest_framework import serializers
from .models import MISReport, NotificationMaster


class MISReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = MISReport
        fields = "__all__"


class NotificationMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationMaster
        fields = "__all__"
