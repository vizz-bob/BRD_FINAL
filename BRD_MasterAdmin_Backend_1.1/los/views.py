# los/views.py
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import LoanApplication, KYCDetail, CreditAssessment
from .serializers import LoanApplicationSerializer, KYCDetailSerializer, CreditAssessmentSerializer
from .permissions import IsTenantMember

class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all().select_related('tenant', 'branch', 'customer', 'created_by')
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated, IsTenantMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'tenant', 'branch', 'customer']
    search_fields = ['application_id', 'customer__first_name', 'customer__phone']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        # created_by handled in serializer.create but keep here for safety
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], url_path='change-status')
    def change_status(self, request, pk=None):
        """
        Custom endpoint to update status of loan application.
        Body: {"status": "APPROVED"} (must be valid choice)
        """
        app = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response({'detail': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)
        app.status = new_status
        app.save()
        return Response(self.get_serializer(app).data)

class KYCDetailViewSet(viewsets.ModelViewSet):
    queryset = KYCDetail.objects.all().select_related('loan_application')
    serializer_class = KYCDetailSerializer
    permission_classes = [IsAuthenticated, IsTenantMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['loan_application', 'kyc_type', 'status']
    search_fields = ['document_number']
    ordering_fields = ['uploaded_at']
    ordering = ['-uploaded_at']

    # override create to allow file uploads
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

class CreditAssessmentViewSet(viewsets.ModelViewSet):
    queryset = CreditAssessment.objects.all().select_related('application')
    serializer_class = CreditAssessmentSerializer
    permission_classes = [IsAuthenticated, IsTenantMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'application']
    search_fields = ['remarks']
    ordering = ['-assessed_at']

    @action(detail=True, methods=['post'], url_path='update-score')
    def update_score(self, request, pk=None):
        ca = self.get_object()
        score = request.data.get('score')
        remarks = request.data.get('remarks', '')
        if score is None:
            return Response({'detail': 'score required'}, status=status.HTTP_400_BAD_REQUEST)
        ca.score = int(score)
        ca.remarks = remarks
        ca.save()
        return Response(self.get_serializer(ca).data)
