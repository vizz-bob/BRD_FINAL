from rest_framework import serializers
from .models import APIIntegration, WebhookLog

class APIIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIIntegration
        fields = "__all__"
        read_only_fields = ("created_at",)

class WebhookLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookLog
        fields = "__all__"
        read_only_fields = ("received_at",)
