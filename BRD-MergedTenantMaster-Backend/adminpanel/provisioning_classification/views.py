from rest_framework import viewsets
from .models import *
from .serializers import *

class LoanClassificationViewSet(viewsets.ModelViewSet):
    queryset = LoanClassification.objects.all()
    serializer_class = LoanClassificationSerializer


class WriteOffRuleViewSet(viewsets.ModelViewSet):
    queryset = WriteOffRule.objects.all()
    serializer_class = WriteOffRuleSerializer


class SettlementRuleViewSet(viewsets.ModelViewSet):
    queryset = SettlementRule.objects.all()
    serializer_class = SettlementRuleSerializer


class ProvisioningNPAViewSet(viewsets.ModelViewSet):
    queryset = ProvisioningNPA.objects.all()
    serializer_class = ProvisioningNPASerializer


class IncentiveManagementViewSet(viewsets.ModelViewSet):
    queryset = IncentiveManagement.objects.all()
    serializer_class = IncentiveManagementSerializer
