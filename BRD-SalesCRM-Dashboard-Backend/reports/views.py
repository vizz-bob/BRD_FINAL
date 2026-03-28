from rest_framework import viewsets
from .models import Report, WeeklySnapshot
from .serializers import ReportSerializer, WeeklySnapshotSerializer

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        queryset = Report.objects.all()
        category = self.request.query_params.get('category')
        metric_name = self.request.query_params.get('metric_name')
        if category:
            queryset = queryset.filter(category=category)
        if metric_name:
            queryset = queryset.filter(metric_name=metric_name)
        return queryset

class WeeklySnapshotViewSet(viewsets.ModelViewSet):
    serializer_class = WeeklySnapshotSerializer
    queryset = WeeklySnapshot.objects.all()