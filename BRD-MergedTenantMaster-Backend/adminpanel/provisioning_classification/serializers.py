from rest_framework import serializers
from .models import *

class LoanClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanClassification
        fields = "__all__"


class WriteOffRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WriteOffRule
        fields = "__all__"


class SettlementRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SettlementRule
        fields = "__all__"


class ProvisioningNPASerializer(serializers.ModelSerializer):
    class Meta:
        model = ProvisioningNPA
        fields = "__all__"


class IncentiveManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncentiveManagement
        fields = "__all__"
