from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *


class EligibilityManagementViewSet(ModelViewSet):
    queryset = EligibilityManagement.objects.all()
    serializer_class = EligibilityManagementSerializer
    permission_classes = [IsAuthenticated]


class BankingManagementViewSet(ModelViewSet):
    queryset = BankingManagement.objects.all()
    serializer_class = BankingManagementSerializer
    permission_classes = [IsAuthenticated]


class ExistingObligationManagementViewSet(ModelViewSet):
    queryset = ExistingObligationManagement.objects.all()
    serializer_class = ExistingObligationManagementSerializer
    permission_classes = [IsAuthenticated]


class ScoreCardManagementViewSet(ModelViewSet):
    queryset = ScoreCardManagement.objects.all()
    serializer_class = ScoreCardManagementSerializer
    permission_classes = [IsAuthenticated]
