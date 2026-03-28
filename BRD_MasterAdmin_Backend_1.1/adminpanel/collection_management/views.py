from rest_framework import viewsets
from .models import *
from .serializers import *

class PaymentGatewayViewSet(viewsets.ModelViewSet):
    queryset = PaymentGateway.objects.all()
    serializer_class = PaymentGatewaySerializer


class CollectionControlViewSet(viewsets.ModelViewSet):
    queryset = CollectionControl.objects.all()
    serializer_class = CollectionControlSerializer


class ClientTeamMappingViewSet(viewsets.ModelViewSet):
    queryset = ClientTeamMapping.objects.all()
    serializer_class = ClientTeamMappingSerializer


class ClientAgentMappingViewSet(viewsets.ModelViewSet):
    queryset = ClientAgentMapping.objects.all()
    serializer_class = ClientAgentMappingSerializer


class PayoutManagementViewSet(viewsets.ModelViewSet):
    queryset = PayoutManagement.objects.all()
    serializer_class = PayoutManagementSerializer
