from rest_framework import serializers
from .models import RawLeadPool, SuppressionList ,  ValidationEngineConfiguration

class RawLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawLeadPool
        fields = '__all__'

class ValidationEngineConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationEngineConfiguration
        fields = '__all__'


class SuppressionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuppressionList
        fields = '__all__'
