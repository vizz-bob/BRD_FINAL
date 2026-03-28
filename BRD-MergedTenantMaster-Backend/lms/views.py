# lms/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import LoanAccount, Repayment, Collection
from .serializers import (
    LoanAccountSerializer,
    RepaymentSerializer,
    CollectionSerializer
)


class LoanAccountViewSet(viewsets.ModelViewSet):
    queryset = LoanAccount.objects.all()
    serializer_class = LoanAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        loan_application = self.request.query_params.get('loan_application')

        if loan_application:
            queryset = queryset.filter(loan_application_id=loan_application)

        return queryset


class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        loan_account = self.request.query_params.get('loan_account')

        if loan_account:
            queryset = queryset.filter(loan_account__account_id=loan_account)

        return queryset


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        loan_account = self.request.query_params.get('loan_account')

        if loan_account:
            queryset = queryset.filter(loan_account__account_id=loan_account)

        return queryset