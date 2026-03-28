from rest_framework import serializers
from .models import ComplianceCheck, RiskFlag

class RiskFlagSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskFlag
        fields = '__all__'

class ComplianceCheckSerializer(serializers.ModelSerializer):
    flags = RiskFlagSerializer(many=True, read_only=True)
    class Meta:
        model = ComplianceCheck
        fields = '__all__'
