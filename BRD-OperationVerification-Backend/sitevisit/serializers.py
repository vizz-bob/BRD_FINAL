from rest_framework import serializers
from .models import (
    SiteVisitReport,
    SiteVisitPhoto,
    Recommendation,
 
    Rejected
)


class SiteVisitPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteVisitPhoto
        fields = "__all__"


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = "__all__"


class SiteVisitReportSerializer(serializers.ModelSerializer):

    photos = SiteVisitPhotoSerializer(many=True, read_only=True)
    recommendations = RecommendationSerializer(many=True, read_only=True)

    class Meta:
        model = SiteVisitReport
        fields = "__all__"
class RejectedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rejected
        fields = "__all__"