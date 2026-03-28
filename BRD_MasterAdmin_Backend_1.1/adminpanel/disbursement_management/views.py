from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *

class DisbursementStageViewSet(ModelViewSet):
    queryset = DisbursementStage.objects.all()
    serializer_class = DisbursementStageSerializer


class DisbursementAgencyViewSet(ModelViewSet):
    queryset = DisbursementAgency.objects.all()
    serializer_class = DisbursementAgencySerializer


class DisbursementFrequencyViewSet(ModelViewSet):
    queryset = DisbursementFrequency.objects.all()
    serializer_class = DisbursementFrequencySerializer


class DisbursementDocumentViewSet(ModelViewSet):
    queryset = DisbursementDocument.objects.all()
    serializer_class = DisbursementDocumentSerializer


class DownPaymentViewSet(ModelViewSet):
    queryset = DownPayment.objects.all()
    serializer_class = DownPaymentSerializer


class DisbursementThirdPartyViewSet(ModelViewSet):
    queryset = DisbursementThirdParty.objects.all()
    serializer_class = DisbursementThirdPartySerializer


class DisbursementViewSet(ModelViewSet):
    queryset = Disbursement.objects.all()
    serializer_class = DisbursementSerializer
