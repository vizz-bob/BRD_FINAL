from rest_framework import serializers
from .models import *

class RuleMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleMaster
        fields = "__all__"

class ImpactValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactValue
        fields = "__all__"

class ClientProfileRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfileRule
        fields = "__all__"

class CollateralQualityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollateralQualityRule
        fields = "__all__"

class FinancialEligibilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialEligibilityRule
        fields = "__all__"

class CreditHistoryRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditHistoryRule
        fields = "__all__"

class InternalScoreRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalScoreRule
        fields = "__all__"

class GeoLocationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoLocationRule
        fields = "__all__"

class RiskMitigationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskMitigationRule
        fields = "__all__"

class InternalVerificationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalVerificationRule
        fields = "__all__"

class AgencyVerificationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyVerificationRule
        fields = "__all__"
