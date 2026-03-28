from rest_framework import serializers
from .models import RepaymentConfiguration


class RepaymentConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepaymentConfiguration
        fields = [
            "id",
            "repayment_type",
            "frequency",
            "limit_in_month",
            "gap_between_disbursement_and_first_repayment",
            "number_of_repayments",
            "sequence_of_repayment_adjustment",
            "repayment_months",
            "repayment_days",
            "repayment_dates",
            "mode_of_collection",
            "is_active",
            "created_at",
        ]
