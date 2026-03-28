from rest_framework.viewsets import ModelViewSet
from .models import MISReport, NotificationMaster
from .serializers import MISReportSerializer, NotificationMasterSerializer


class MISReportViewSet(ModelViewSet):
    queryset = MISReport.objects.all()
    serializer_class = MISReportSerializer


class NotificationMasterViewSet(ModelViewSet):
    queryset = NotificationMaster.objects.all()
    serializer_class = NotificationMasterSerializer
