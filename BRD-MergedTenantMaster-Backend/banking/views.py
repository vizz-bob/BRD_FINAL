from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from banking.models import Mandate
from .serializers import BankingDashboardSerializer


class BankingDashboardViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankingDashboardSerializer

    queryset = (
        Mandate.objects
        .select_related(
            "loan_application",
            "loan_application__created_by",
            "loan_application__credit_assessment",
        )
    )