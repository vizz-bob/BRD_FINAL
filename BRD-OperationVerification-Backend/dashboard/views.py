from rest_framework import viewsets
from .models import OperationsDashboard, PendingTask, SLABreachAlert
from .serializers import OperationsDashboardSerializer, PendingTaskSerializer, SLABreachAlertSerializer


class OperationsDashboardViewSet(viewsets.ModelViewSet):
    queryset = OperationsDashboard.objects.all().order_by("-created_at")
    serializer_class = OperationsDashboardSerializer
    
class SLABreachAlertViewSet(viewsets.ModelViewSet):
    queryset = SLABreachAlert.objects.all().order_by("-created_at")
    serializer_class = SLABreachAlertSerializer

class PendingTaskViewSet(viewsets.ModelViewSet):
    queryset = PendingTask.objects.all().order_by("due_date")
    serializer_class = PendingTaskSerializer
