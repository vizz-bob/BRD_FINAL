from rest_framework import viewsets
from .models import (
    SiteVisitReport,
    SiteVisitPhoto,
    Recommendation,
   
    Rejected
)

from .serializers import (
    SiteVisitReportSerializer,
    SiteVisitPhotoSerializer,
    RecommendationSerializer,

    RejectedSerializer
)


class SiteVisitReportViewSet(viewsets.ModelViewSet):
    queryset = SiteVisitReport.objects.all().order_by("-created_at")
    serializer_class = SiteVisitReportSerializer


class SiteVisitPhotoViewSet(viewsets.ModelViewSet):
    queryset = SiteVisitPhoto.objects.all()
    serializer_class = SiteVisitPhotoSerializer


class RecommendationViewSet(viewsets.ModelViewSet):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer




class RejectedViewSet(viewsets.ModelViewSet):
    queryset = Rejected.objects.all().order_by("-created_at")
    serializer_class = RejectedSerializer