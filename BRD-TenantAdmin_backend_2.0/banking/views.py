from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated

from banking.models import Mandate
from .serializers import BankingDashboardSerializer


class BankingDashboardViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankingDashboardSerializer

    queryset = (
        Mandate.objects
        .select_related(
            "loan_application",
            "loan_application__created_by",
            "loan_application__property_detail",
            "loan_application__credit_assessment",
            "loan_application__mortgage_underwriting",
        )
    )

