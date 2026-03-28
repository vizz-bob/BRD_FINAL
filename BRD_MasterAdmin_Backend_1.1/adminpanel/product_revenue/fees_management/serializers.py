from rest_framework import serializers
from .models import Fee


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = [
            "id",
            "name",
            "fees_frequency",
            "basis_of_fees",
            "fees_recovery_stage",
            "fees_recovery_mode",
            "fees_rate",
            "is_active",
            "created_at",
        ]
