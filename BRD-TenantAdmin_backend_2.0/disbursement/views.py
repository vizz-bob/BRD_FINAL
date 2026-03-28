from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from .models import LoanAccount
from .serializers import (
    LoanAccountListSerializer,
    LoanAccountDetailSerializer,
    LoanAccountCreateUpdateSerializer,
    DisbursementQueueSerializer,
)


# ==========================================
# 1. List Loan Accounts
# ==========================================
class LoanAccountListAPIView(ListAPIView):
    queryset = LoanAccount.objects.select_related("loan_application")
    serializer_class = LoanAccountListSerializer


# ==========================================
# 2. Retrieve Loan Account
# ==========================================
class LoanAccountDetailAPIView(RetrieveAPIView):
    queryset = LoanAccount.objects.select_related("loan_application")
    serializer_class = LoanAccountDetailSerializer
    lookup_field = "id"


# ==========================================
# 3. Create Loan Account
# ==========================================
class LoanAccountCreateAPIView(CreateAPIView):
    queryset = LoanAccount.objects.all()
    serializer_class = LoanAccountCreateUpdateSerializer


# ==========================================
# 4. Update Loan Account
# ==========================================
class LoanAccountUpdateAPIView(UpdateAPIView):
    queryset = LoanAccount.objects.all()
    serializer_class = LoanAccountCreateUpdateSerializer
    lookup_field = "id"


# ==========================================
# 5. Disbursement Queue
# ==========================================
class DisbursementQueueAPIView(ListAPIView):
    serializer_class = DisbursementQueueSerializer

    def get_queryset(self):
        return LoanAccount.objects.select_related(
            "loan_application"
        ).filter(
            enach_status="SUCCESS",
            penny_drop_status="SUCCESS",
            disbursement_status="PENDING"
        )


# ==========================================
# 6. Disburse Loan
# ==========================================
class DisburseLoanAPIView(APIView):

    @transaction.atomic
    def post(self, request, loan_account_id):

        try:
            loan_account = LoanAccount.objects.get(id=loan_account_id)
        except LoanAccount.DoesNotExist:
            return Response(
                {"detail": "Loan account not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if loan_account.disbursement_status == "COMPLETED":
            return Response(
                {"detail": "Loan already disbursed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if (
            loan_account.enach_status != "SUCCESS"
            or loan_account.penny_drop_status != "SUCCESS"
        ):
            return Response(
                {"detail": "Loan not eligible for disbursement"},
                status=status.HTTP_400_BAD_REQUEST
            )

        loan_account.disbursement_status = "COMPLETED"
        loan_account.save(update_fields=["disbursement_status"])

        return Response(
            {"detail": "Loan disbursed successfully"},
            status=status.HTTP_200_OK
        )
