from rest_framework import serializers
from .models import *

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = "__all__"


class GeoLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoLocation
        fields = "__all__"


class LoginAuthenticationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAuthentication
        fields = "__all__"


class CoApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoApplicant
        fields = "__all__"


class LoginFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginFee
        fields = "__all__"


class JointApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = JointApplicant
        fields = "__all__"


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = "__all__"


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = "__all__"


class ApplicationProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationProcess
        fields = "__all__"


class ScoreCardRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreCardRating
        fields = "__all__"
