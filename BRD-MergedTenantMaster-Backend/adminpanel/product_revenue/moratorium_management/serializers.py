from rest_framework import serializers
from .models import Moratorium


class MoratoriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moratorium
        fields = [
            "id",
            "moratorium_type",
            "period_value",
            "period_unit",
            "amount",
            "effect_of_moratorium",
            "interest_rationalisation",
            "is_active",
            "created_at",
        ]
