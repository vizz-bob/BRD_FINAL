from rest_framework import serializers
from banking.models import Mandate


class BankingDashboardSerializer(serializers.ModelSerializer):

    application_id = serializers.IntegerField(
        source="loan_application.id",
        read_only=True,
    )

    customer = serializers.CharField(
        source="customer_name",
        read_only=True,
    )

    bank = serializers.CharField(
        source="bank_name",
        read_only=True,
    )

    class Meta:
        model = Mandate
        fields = [
            "id",
            "application_id",
            "customer",
            "bank",
            "penny_drop_status",
            "enach_status",
            "action",
        ]
