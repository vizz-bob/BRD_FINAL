from rest_framework import serializers
from .models import (
    RuleMaster, ImpactValue,
    ClientProfileRule,
    FinancialEligibilityRule,
    CollateralQualityRule,
    CreditHistoryRule,
    InternalScoreRule,
    GeoLocationRule,
    RiskMitigationRule,
    InternalVerificationRule,
    AgencyVerificationRule,
    TenantRuleConfig,
)


class RuleMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleMaster
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class ImpactValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactValue
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class ClientProfileRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfileRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class FinancialEligibilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialEligibilityRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class CollateralQualityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollateralQualityRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class CreditHistoryRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditHistoryRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class InternalScoreRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalScoreRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class GeoLocationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoLocationRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class RiskMitigationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskMitigationRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class InternalVerificationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalVerificationRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class AgencyVerificationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyVerificationRule
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class TenantRuleConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantRuleConfig
        fields = ["id", "tenant", "config", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
