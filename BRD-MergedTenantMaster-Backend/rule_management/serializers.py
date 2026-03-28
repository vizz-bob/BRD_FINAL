from rest_framework import serializers
from .models import (
    RuleIdentification,
    ClientProfileRule,
    FinancialEligibilityRule,
    CollateralQualityRule,
    AutomatedScorecard,
    AgencyVerificationRule
)


class RuleIdentificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleIdentification
        fields = "__all__"


class ClientProfileRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProfileRule
        fields = "__all__"


class FinancialEligibilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialEligibilityRule
        fields = "__all__"


class CollateralQualityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollateralQualityRule
        fields = "__all__"


class AutomatedScorecardSerializer(serializers.ModelSerializer):
    class Meta:
        model = AutomatedScorecard
        fields = "__all__"


class AgencyVerificationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgencyVerificationRule
        fields = "__all__"