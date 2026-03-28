from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Payout
from .serializers import PayoutSerializer, PayoutDetailSerializer
from django.db.models import Sum, Q
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class PayoutViewSet(viewsets.ModelViewSet):
    """
    Payout Management ViewSet
    """
    serializer_class = PayoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    ADMIN_ROLES = {'ADMIN', 'admin'}
    PARTNER_ROLES = {'PARTNER', 'channel_partner'}

    def _normalized_role(self, user):
        return str(getattr(user, 'role', '')).strip()
    
    def get_queryset(self):
        user = self.request.user
        queryset = Payout.objects.select_related('lead', 'partner')
        role = self._normalized_role(user)
        
        if role in self.ADMIN_ROLES:
            queryset = queryset.order_by('-created_at')
        elif role in self.PARTNER_ROLES:
            queryset = queryset.filter(partner=user).order_by('-created_at')
        else:
            return Payout.objects.none()

        # Handle timeframe filter
        timeframe = self.request.query_params.get('timeframe')
        now = timezone.now()
        
        if timeframe == 'this_month':
            queryset = queryset.filter(created_at__year=now.year, created_at__month=now.month)
        elif timeframe == 'last_3_months':
            three_months_ago = now - timedelta(days=90)
            queryset = queryset.filter(created_at__gte=three_months_ago)
            
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PayoutDetailSerializer
        return PayoutSerializer
    
    @action(detail=True, methods=['get'])
    def download_invoice(self, request, pk=None):
        """
        Mock endpoint for invoice download
        """
        payout = self.get_object()
        # In a real app, this would generate a PDF or return a file URL
        return Response({
            'message': f'Invoice for payout {payout.payout_id} is ready',
            'download_url': f'/media/invoices/{payout.payout_id}.pdf',
            'payout_id': payout.payout_id,
            'amount': str(payout.commission_amount)
        })

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Get payout summary statistics for the Ledger
        """
        user = request.user
        payouts = self.get_queryset() # This will apply role filtering
        
        total_payouts = payouts.count()
        total_amount = payouts.aggregate(Sum('commission_amount'))['commission_amount__sum'] or Decimal('0')
        pending_amount = payouts.filter(status='PENDING').aggregate(Sum('commission_amount'))['commission_amount__sum'] or Decimal('0')
        paid_amount = payouts.filter(status='PAID').aggregate(Sum('commission_amount'))['commission_amount__sum'] or Decimal('0')
        
        now = timezone.now()
        month_amount = payouts.filter(
            created_at__year=now.year,
            created_at__month=now.month
        ).aggregate(Sum('commission_amount'))['commission_amount__sum'] or Decimal('0')
        
        return Response({
            'pending_amount': str(pending_amount),
            'paid_amount': str(paid_amount),
            'month_amount': str(month_amount),
            'total_amount': str(total_amount),
            'total_count': total_payouts,
            'pending_count': payouts.filter(status='PENDING').count(),
            'paid_count': payouts.filter(status='PAID').count()
        })

    @action(detail=True, methods=['patch'])
    def mark_paid(self, request, pk=None):
        if self._normalized_role(request.user) not in self.ADMIN_ROLES:
            return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
        
        payout = self.get_object()
        if payout.status == 'PAID':
            return Response({'error': 'Already paid'}, status=status.HTTP_400_BAD_REQUEST)
        
        payout.status = 'PAID'
        payout.transaction_id = request.data.get('transaction_id')
        payout.save()
        
        return Response({'message': 'Marked as paid', 'payout_id': payout.payout_id})

    @action(detail=False, methods=['post'])
    def bulk_mark_paid(self, request):
        if self._normalized_role(request.user) not in self.ADMIN_ROLES:
            return Response({'error': 'Admin only'}, status=status.HTTP_403_FORBIDDEN)
        
        payout_ids = request.data.get('payout_ids', [])
        payouts = Payout.objects.filter(id__in=payout_ids, status='PENDING')
        count = payouts.count()
        payouts.update(status='PAID', paid_at=timezone.now())
        
        return Response({'message': f'{count} payouts marked as paid'})
