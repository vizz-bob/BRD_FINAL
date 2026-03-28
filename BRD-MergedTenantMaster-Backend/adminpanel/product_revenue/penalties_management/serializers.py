from rest_framework import serializers
from .models import Penalty


class PenaltySerializer(serializers.ModelSerializer):
    class Meta:
        model = Penalty
        fields = [
            "id",
            "penalty_name",
            "frequency",
            "basis_of_recovery",
            "recovery_stage",
            "recovery_mode",
            "rate_of_penalty",
            "is_active",
            "created_at",
        ]
