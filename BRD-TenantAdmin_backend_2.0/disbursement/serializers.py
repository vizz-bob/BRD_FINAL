from rest_framework import serializers
from .models import LoanAccount


# ==========================================
# 1. LoanAccount List Serializer
# ==========================================
class LoanAccountListSerializer(serializers.ModelSerializer):

    loan_application_id = serializers.IntegerField(
        source="loan_application.id",
        read_only=True
    )

    bank = serializers.CharField(
        source="bank_detail",
        read_only=True
    )

    class Meta:
        model = LoanAccount
        fields = [
            "id",
            "loan_application_id",
            "bank",
            "amount",
            "enach_status",
            "penny_drop_status",
            "disbursement_status",
            "created_at",
        ]


# ==========================================
# 2. LoanAccount Detail Serializer
# ==========================================
class LoanAccountDetailSerializer(serializers.ModelSerializer):

    loan_application_id = serializers.IntegerField(
        source="loan_application.id",
        read_only=True
    )

    bank = serializers.CharField(
        source="bank_detail",
        read_only=True
    )

    class Meta:
        model = LoanAccount
        fields = [
            "id",
            "loan_application_id",
            "bank",
            "amount",
            "enach_status",
            "penny_drop_status",
            "disbursement_status",
            "failure_reason",
            "created_at",
            "updated_at",
        ]


# ==========================================
# 3. Create / Update Serializer
# ==========================================
class LoanAccountCreateUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = LoanAccount
        fields = [
            "loan_application",
            "bank_detail",
            "amount",
            "enach_status",
            "penny_drop_status",
            "disbursement_status",
            "failure_reason",
        ]

    def validate(self, data):
        enach_status = data.get(
            "enach_status",
            getattr(self.instance, "enach_status", None)
        )
        penny_status = data.get(
            "penny_drop_status",
            getattr(self.instance, "penny_drop_status", None)
        )
        failure_reason = data.get(
            "failure_reason",
            getattr(self.instance, "failure_reason", None)
        )

        if (
            enach_status == "FAILED"
            or penny_status == "FAILED"
        ) and not failure_reason:
            raise serializers.ValidationError(
                "Failure reason is required when status is FAILED."
            )

        return data


# ==========================================
# 4. Disbursement Queue Serializer
# ==========================================
class DisbursementQueueSerializer(serializers.ModelSerializer):

    applicant = serializers.SerializerMethodField()
    bank = serializers.CharField(
        source="bank_detail",
        read_only=True
    )

    class Meta:
        model = LoanAccount
        fields = ["id", "applicant", "amount", "bank"]

    def get_applicant(self, obj):
        if obj.loan_application:
            return str(obj.loan_application)
        return "-"
