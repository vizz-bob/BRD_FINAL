from rest_framework import serializers
from .models import Charge


class ChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Charge
        fields = [
            "id",
            "charge_name",
            "frequency",
            "basis_of_recovery",
            "recovery_stage",
            "recovery_mode",
            "rate_of_charges",
            "is_active",
            "created_at",
        ]
