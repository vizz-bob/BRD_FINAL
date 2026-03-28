from rest_framework import serializers
from .models import (
    LoanImprovementRequest,
    InterestRateChange,
    TenureChange,
    EMIChange,
    ProductChange,
    FeeChange,
    CollateralChange,
    RepaymentRationalisation,
    InterestMoratorium,
    TopUpRequest
)


class LoanImprovementRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanImprovementRequest
        fields = "__all__"
        read_only_fields = ("id", "requested_by", "status", "created_at")


class InterestRateChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestRateChange
        fields = "__all__"


class TenureChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenureChange
        fields = "__all__"


class EMIChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EMIChange
        fields = "__all__"


class ProductChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductChange
        fields = "__all__"


class FeeChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeChange
        fields = "__all__"


class CollateralChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollateralChange
        fields = "__all__"


class RepaymentRationalisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepaymentRationalisation
        fields = "__all__"


class InterestMoratoriumSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestMoratorium
        fields = "__all__"


class TopUpRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopUpRequest
        fields = "__all__"
