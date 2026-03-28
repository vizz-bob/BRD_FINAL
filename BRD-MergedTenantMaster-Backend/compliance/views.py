from rest_framework import viewsets
from .models import ComplianceCheck, RiskFlag
from .serializers import ComplianceCheckSerializer, RiskFlagSerializer
from users.permissions import DefaultPermission

class ComplianceCheckViewSet(viewsets.ModelViewSet):
    queryset = ComplianceCheck.objects.all()
    serializer_class = ComplianceCheckSerializer
    permission_classes = [DefaultPermission]

class RiskFlagViewSet(viewsets.ModelViewSet):
    queryset = RiskFlag.objects.all()
    serializer_class = RiskFlagSerializer
    permission_classes = [DefaultPermission]
