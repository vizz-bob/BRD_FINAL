from rest_framework import serializers
from .models import *

class DisbursementStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisbursementStage
        fields = "__all__"


class DisbursementAgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = DisbursementAgency
        fields = "__all__"


class DisbursementFrequencySerializer(serializers.ModelSerializer):
    class Meta:
        model = DisbursementFrequency
        fields = "__all__"


class DisbursementDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisbursementDocument
        fields = "__all__"


class DownPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DownPayment
        fields = "__all__"


class DisbursementThirdPartySerializer(serializers.ModelSerializer):
    class Meta:
        model = DisbursementThirdParty
        fields = "__all__"


class DisbursementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disbursement
        fields = "__all__"
