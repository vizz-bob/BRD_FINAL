from rest_framework import serializers
from .models import *


class RiskManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskManagement
        fields = "__all__"


class RiskMitigationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskMitigation
        fields = "__all__"


class DeviationManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviationManagement
        fields = "__all__"


class RiskContainmentUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskContainmentUnit
        fields = "__all__"


class FraudManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraudManagement
        fields = "__all__"


class PortfolioLimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioLimit
        fields = "__all__"


class DefaultLimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultLimit
        fields = "__all__"


class RiskOtherSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskOther
        fields = "__all__"
