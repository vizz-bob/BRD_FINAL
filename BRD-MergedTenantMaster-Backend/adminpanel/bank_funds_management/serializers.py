from rest_framework import serializers
from .models import *


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = "__all__"


class FundTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundType
        fields = "__all__"


class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = "__all__"


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = "__all__"


class ModeOfBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModeOfBank
        fields = "__all__"


class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = "__all__"


class BusinessModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessModel
        fields = "__all__"
