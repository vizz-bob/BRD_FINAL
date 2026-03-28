from rest_framework import serializers
from .models import *


class EligibilityManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = EligibilityManagement
        fields = "__all__"


class BankingManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankingManagement
        fields = "__all__"


class ExistingObligationManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExistingObligationManagement
        fields = "__all__"


class ScoreCardManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreCardManagement
        fields = "__all__"
