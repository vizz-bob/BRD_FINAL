from rest_framework import generics
from .models import *
from .serializers import *


class RiskManagementListCreateAPIView(generics.ListCreateAPIView):
    queryset = RiskManagement.objects.all()
    serializer_class = RiskManagementSerializer


class RiskMitigationListCreateAPIView(generics.ListCreateAPIView):
    queryset = RiskMitigation.objects.all()
    serializer_class = RiskMitigationSerializer


class DeviationManagementListCreateAPIView(generics.ListCreateAPIView):
    queryset = DeviationManagement.objects.all()
    serializer_class = DeviationManagementSerializer


class RiskContainmentUnitListCreateAPIView(generics.ListCreateAPIView):
    queryset = RiskContainmentUnit.objects.all()
    serializer_class = RiskContainmentUnitSerializer


class FraudManagementListCreateAPIView(generics.ListCreateAPIView):
    queryset = FraudManagement.objects.all()
    serializer_class = FraudManagementSerializer


class PortfolioLimitListCreateAPIView(generics.ListCreateAPIView):
    queryset = PortfolioLimit.objects.all()
    serializer_class = PortfolioLimitSerializer


class DefaultLimitListCreateAPIView(generics.ListCreateAPIView):
    queryset = DefaultLimit.objects.all()
    serializer_class = DefaultLimitSerializer


class RiskOtherListCreateAPIView(generics.ListCreateAPIView):
    queryset = RiskOther.objects.all()
    serializer_class = RiskOtherSerializer
