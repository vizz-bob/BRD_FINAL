from rest_framework import serializers
from .models import (
    NewValuationRequest,
    GenerateNewReport,
    ValuationDashboard,
    LocationDistribution,
    Valuation,
)


class NewValuationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewValuationRequest
        fields = "__all__"


class GenerateNewReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenerateNewReport
        fields = "__all__"


class ValuationDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValuationDashboard
        fields = "__all__"


class LocationDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationDistribution
        fields = "__all__"


class ValuationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valuation
        fields = "__all__"