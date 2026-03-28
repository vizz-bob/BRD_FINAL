from rest_framework import serializers
from .models import InterestConfiguration


class InterestConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestConfiguration
        fields = [
            "id",
            "benchmark_type",
            "benchmark_frequency",
            "benchmark_rate",
            "mark_up",
            "interest_type",
            "accrual_stage",
            "accrual_method",
            "interest_rate",
            "is_active",
            "created_at",
        ]
