from rest_framework import serializers
from .models import EscalationRule


class EscalationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationRule
        fields = '__all__'
