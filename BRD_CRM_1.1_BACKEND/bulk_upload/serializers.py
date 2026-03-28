
from rest_framework import serializers
from .models import FileUpload, ManualEntry, FtpIntegration, ApiIntegration


# ---------------------------
# File Upload Serializer
# ---------------------------

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = "__all__"


# ---------------------------
# Manual Entry Serializer
# ---------------------------

class ManualEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualEntry
        fields = "__all__"

    def validate_mobile_number(self, value):
        if value:
            if not value.isdigit():
                raise serializers.ValidationError("Mobile number must contain only digits.")
            if len(value) < 10:
                raise serializers.ValidationError("Mobile number must be at least 10 digits.")
        return value


# ---------------------------
# FTP Integration Serializer
# ---------------------------

class FtpIntegrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = FtpIntegration
        fields = "__all__"

    def validate_port(self, value):
        if value <= 0 or value > 65535:
            raise serializers.ValidationError("Port must be between 1 and 65535.")
        return value


# ---------------------------
# API Integration Serializer
# ---------------------------

class ApiIntegrationSerializer(serializers.ModelSerializer):
    api_key = serializers.CharField(write_only=True)

    class Meta:
        model = ApiIntegration
        fields = "__all__"

    def validate_api_endpoint_url(self, value):
        if value and not value.startswith(("http://", "https://")):
            raise serializers.ValidationError("API endpoint must start with http:// or https://")
        return value
