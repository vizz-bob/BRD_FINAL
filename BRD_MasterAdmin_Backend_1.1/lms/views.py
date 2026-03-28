# lms/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import LoanAccount, Repayment, Collection
from .serializers import LoanAccountSerializer, RepaymentSerializer, CollectionSerializer
from .permissions import IsTenantMember

class LoanAccountViewSet(viewsets.ModelViewSet):
    queryset = LoanAccount.objects.all().select_related('loan_application')
    serializer_class = LoanAccountSerializer
    permission_classes = [IsAuthenticated, IsTenantMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['loan_application', 'account_id']
    search_fields = ['account_id', 'loan_application__application_id']
    ordering = ['-disbursed_at']

    @action(detail=True, methods=['post'], url_path='disburse')
    def disburse(self, request, pk=None):
        la = self.get_object()
        # sample: mark disbursed_at if not set
        if la.disbursed_at:
            return Response({'detail': 'already disbursed'}, status=status.HTTP_400_BAD_REQUEST)
        la.disbursed_at = request.data.get('disbursed_at', None)
        # optionally set outstanding principal
        outstanding = request.data.get('outstanding_principal')
        if outstanding is not None:
            la.outstanding_principal = outstanding
        la.save()
        return Response(self.get_serializer(la).data)

class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all().select_related('loan_account')
    serializer_class = RepaymentSerializer
    permission_classes = [IsAuthenticated, IsTenantMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['loan_account']
    ordering = ['-paid_at']

    def create(self, request, *args, **kwargs):
        # create repayment and optionally update outstanding principal on LoanAccount
        resp = super().create(request, *args, **kwargs)
        # optionally: adjust outstanding
        try:
            loan_account_id = resp.data.get('loan_account')
            amount = float(resp.data.get('amount', 0))
            if loan_account_id:
                la = LoanAccount.objects.get(id=loan_account_id)
                if la.outstanding_principal is not None:
                    la.outstanding_principal = la.outstanding_principal - amount
                    la.save()
        except Exception:
            pass
        return resp

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all().select_related('loan_account', 'collector')
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated, IsTenantMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['loan_account', 'collector']
    ordering = ['-collected_at']
