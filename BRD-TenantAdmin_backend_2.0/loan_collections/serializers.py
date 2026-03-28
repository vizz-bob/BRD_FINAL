from rest_framework import serializers
from .models import Delinquency


# ==========================================
# 1. Delinquency List Serializer
# (For table / dashboard view)
# ==========================================
class DelinquencyListSerializer(serializers.ModelSerializer):

    loan_account_id = serializers.IntegerField(
        source="loan_account.id",
        read_only=True
    )

    class Meta:
        model = Delinquency
        fields = [
            "id",
            "loan_account_id",
            "borrower_name",
            "dpd",
            "overdue_amount",
            "bucket",
            "action_type",
            "created_at",
        ]


# ==========================================
# 2. Delinquency Detail Serializer
# ==========================================
class DelinquencyDetailSerializer(serializers.ModelSerializer):

    loan_account_id = serializers.IntegerField(
        source="loan_account.id",
        read_only=True
    )

    class Meta:
        model = Delinquency
        fields = "__all__"


# ==========================================
# 3. Create / Update Serializer
# ==========================================
class DelinquencyCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Delinquency
        fields = [
            "loan_account",
            "borrower_name",
            "dpd",
            "overdue_amount",
            "bucket",
            "action_type",
            "remarks",
        ]

    def validate(self, data):
        dpd = data.get("dpd")

        if dpd is not None and dpd < 0:
            raise serializers.ValidationError(
                {"dpd": "DPD cannot be negative."}
            )

        return data
