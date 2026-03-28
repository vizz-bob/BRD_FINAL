from rest_framework import serializers
from .models import (
    SanctionDocument,
    LoanDocument,
    CollateralDocument
)

class SanctionDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SanctionDocument
        fields = "__all__"

class LoanDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanDocument
        fields = "__all__"

class CollateralDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollateralDocument
        fields = "__all__"
