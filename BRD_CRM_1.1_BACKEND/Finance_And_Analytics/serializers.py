from rest_framework import serializers
from .models import LoanAccount,Repayment,CollectionBucket,PromiseToPay,InteractionLog,RecoveryCase,SettlementDocument,Forecast,Campaign,Lead,AgentTarget ,Target,ActivityTarget,ConversionTarget, CampaignROI,TargetHistory


class RepaymentSerializer(serializers.ModelSerializer):
    emi_count = serializers.IntegerField(
        source="loan.emi_count",
        read_only=True
    )
    borrower_name = serializers.CharField(
        source="loan.borrower_name",
        read_only=True
    )
    loan_id = serializers.IntegerField(
        source="loan.id",
        read_only=True
    )
    loan_no = serializers.IntegerField(
        source="loan.loan_number",
        read_only=True
    )
    class Meta:
        model = Repayment
        fields = "__all__"
class LoanLedgerSerializer(serializers.ModelSerializer):
    repayments = RepaymentSerializer(many=True, read_only=True)

    class Meta:
        model = LoanAccount
        fields = (
            "id",
            "borrower_name",
            "loan_number",
            "outstanding_balance",
            "emi_amount",
            "emi_count",
            "repayments",
        )
class CollectionBucketSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionBucket
        fields = "__all__"

class PromiseToPaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PromiseToPay
        fields = "__all__"
class InteractionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InteractionLog
        fields = "__all__"
class RecoveryCaseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="loan.borrower_name", read_only=True)
    agent_name = serializers.CharField(source="assigned_agent.first_name", read_only=True)
    class Meta:
        model = RecoveryCase
        fields = "__all__"
class SettlementDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettlementDocument
        fields = "__all__"


class ForecastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forecast
        fields = '__all__'
class TrendPointSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.DecimalField(max_digits=14, decimal_places=2)
class CampaignBreakdownSerializer(serializers.Serializer):
    campaign = serializers.CharField()
    leads = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
class AgentPerformanceSerializer(serializers.Serializer):
    agent = serializers.CharField()
    target = serializers.DecimalField(max_digits=12, decimal_places=2)
    achieved = serializers.DecimalField(max_digits=12, decimal_places=2)
    achievement_percent = serializers.FloatField()
    variance = serializers.DecimalField(max_digits=12, decimal_places=2)
    expected_deals = serializers.IntegerField()
    status = serializers.CharField()


class TargetSerializer(serializers.ModelSerializer):
    achievement_percent = serializers.FloatField(read_only=True)
    variance = serializers.FloatField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Target
        fields = "__all__"


class ActivityTargetSerializer(serializers.ModelSerializer):
    progress = serializers.FloatField(read_only=True)

    class Meta:
        model = ActivityTarget
        fields = "__all__"


class ConversionTargetSerializer(serializers.ModelSerializer):
    achievement = serializers.FloatField(read_only=True)

    class Meta:
        model = ConversionTarget
        fields = "__all__"


class CampaignROISerializer(serializers.ModelSerializer):
    cpl = serializers.FloatField(read_only=True)
    conversion_rate = serializers.FloatField(read_only=True)
    roi = serializers.FloatField(read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = CampaignROI
        fields = "__all__"


class TargetHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TargetHistory
        fields = "__all__"