from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *


class BankViewSet(ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer


class FundTypeViewSet(ModelViewSet):
    queryset = FundType.objects.all()
    serializer_class = FundTypeSerializer


class FundViewSet(ModelViewSet):
    queryset = Fund.objects.all()
    serializer_class = FundSerializer


class PortfolioViewSet(ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer


class ModeOfBankViewSet(ModelViewSet):
    queryset = ModeOfBank.objects.all()
    serializer_class = ModeOfBankSerializer


class TaxViewSet(ModelViewSet):
    queryset = Tax.objects.all()
    serializer_class = TaxSerializer


class BusinessModelViewSet(ModelViewSet):
    queryset = BusinessModel.objects.all()
    serializer_class = BusinessModelSerializer
