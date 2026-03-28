from rest_framework import generics, status, views, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from django.db.models import Q, Sum, Count
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.authtoken.models import Token
from datetime import datetime

from .models import (
    Tenant,
    Setting,
    Loan,
    Dashboard,
    Disbursement,
    ReconciliationTransaction,
    Repayment,
    PaymentRecord,
    Reminder,
)
from .serializers import (
    SignupSerializer,
    TenantSerializer,
    SettingSerializer,
    LoanSerializer,
    DashboardSerializer,
    DisbursementSerializer,
    ReconciliationTransactionSerializer,
    RepaymentSerializer,
    PaymentRecordSerializer,
    ReminderSerializer,
)

User = get_user_model()

class SignupView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(pk=response.data['id'])
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': response.data,
            'token': token.key,
        }, status=status.HTTP_201_CREATED)

# ===== LOAN VIEWS =====
class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        queryset = Loan.objects.all()
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(loan_id__icontains=search) | 
                Q(borrower_name__icontains=search)
            )
        return queryset

# ===== TENANT VIEWS =====
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

# ===== SETTING VIEWS =====
class SettingViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

# ===== DASHBOARD VIEWS =====
class DashboardViewSet(viewsets.ModelViewSet):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    @action(detail=False, methods=['get'])
    def get_latest(self, request):
        """Get the latest dashboard metrics"""
        dashboard = Dashboard.objects.latest('created_at')
        serializer = self.get_serializer(dashboard)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get dashboard summary with calculated metrics"""
        total_disbursed = Disbursement.objects.filter(
            status='Paid'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        pending_disbursement = Disbursement.objects.filter(
            status='Pending'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        total_repayment = Repayment.objects.filter(
            status='Paid'
        ).aggregate(Sum('amount_due'))['amount_due__sum'] or 0
        
        overdue_amount = Repayment.objects.filter(
            status='Overdue'
        ).aggregate(Sum('amount_due'))['amount_due__sum'] or 0
        
        return Response({
            'totalDisbursed': float(total_disbursed),
            'pendingDisbursement': float(pending_disbursement),
            'totalRepayment': float(total_repayment),
            'overdueAmount': float(overdue_amount),
        })

# ===== DISBURSEMENT VIEWS =====
class DisbursementViewSet(viewsets.ModelViewSet):
    queryset = Disbursement.objects.all()
    serializer_class = DisbursementSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        queryset = Disbursement.objects.all()
        status_filter = self.request.query_params.get('status')
        date_from = self.request.query_params.get('dateFrom')
        date_to = self.request.query_params.get('dateTo')
        search = self.request.query_params.get('search')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if search:
            queryset = queryset.filter(
                Q(disbursement_id__icontains=search) |
                Q(recipient_name__icontains=search)
            )
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get disbursement dashboard metrics"""
        total_disbursed = Disbursement.objects.filter(
            status='Paid'
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        today = timezone.now().date()
        disbursed_this_month_qs = Disbursement.objects.filter(
            status='Paid',
            date__year=today.year,
            date__month=today.month,
        )
        disbursed_this_month_value = disbursed_this_month_qs.aggregate(
            Sum('amount')
        )['amount__sum'] or 0
        disbursed_this_month_count = disbursed_this_month_qs.count()
        
        pending_count = Disbursement.objects.filter(
            status='Pending'
        ).count()
        pending_value = Disbursement.objects.filter(
            status='Pending'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        failed_count = Disbursement.objects.filter(
            status='Failed'
        ).count()
        failed_value = Disbursement.objects.filter(
            status='Failed'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        status_dist = Disbursement.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        # Get disbursements by payment method
        method_dist = Disbursement.objects.filter(
            status='Paid'
        ).values('payment_method').annotate(
            total_amount=Sum('amount')
        ).order_by('payment_method')
        
        # Get all disbursements for the table
        all_disbursements = Disbursement.objects.all().order_by('-date')
        disbursement_list = []
        for disb in all_disbursements:
            disbursement_list.append({
                'disbursementId': disb.disbursement_id,
                'loanId': disb.loan.loan_id if disb.loan else '',
                'recipientName': disb.recipient_name,
                'amount': float(disb.amount),
                'date': disb.date.strftime('%Y-%m-%d'),
                'status': disb.status,
                'paymentMethod': disb.payment_method,
            })
        
        # Map payment methods to readable names
        method_name_map = {
            'BANK_TRANSFER': 'Bank Transfer',
            'RTGS': 'RTGS',
            'NEFT': 'NEFT',
        }
        
        return Response({
            'kpis': {
                'totalDisbursed': {'value': float(total_disbursed)},
                'pendingDisbursementsValue': {
                    'value': float(pending_value),
                    'count': pending_count
                },
                'disbursedThisMonth': {
                    'value': float(disbursed_this_month_value),
                    'count': disbursed_this_month_count
                },
                'failedTransactions': {
                    'value': float(failed_value),
                    'count': failed_count
                }
            },
            'statusDistribution': [
                {
                    'status': item['status'],
                    'count': item['count'],
                    'color': '#15803d' if item['status'] == 'Paid' else '#ca8a04' if item['status'] == 'Pending' else '#b91c1c'
                }
                for item in status_dist
            ],
            'disbursementByMethod': [
                {
                    'method': method_name_map.get(item['payment_method'], item['payment_method']),
                    'amount': float(item['total_amount'])
                }
                for item in method_dist
            ],
            'allDisbursements': disbursement_list
        })

# ===== RECONCILIATION VIEWS =====
class ReconciliationTransactionViewSet(viewsets.ModelViewSet):
    queryset = ReconciliationTransaction.objects.all()
    serializer_class = ReconciliationTransactionSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        queryset = ReconciliationTransaction.objects.all()
        status_filter = self.request.query_params.get('statusFilter')
        date_from = self.request.query_params.get('dateFrom')
        date_to = self.request.query_params.get('dateTo')
        desc_query = self.request.query_params.get('descriptionQuery')
        
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        if date_from:
            queryset = queryset.filter(transaction_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(transaction_date__lte=date_to)
        if desc_query:
            queryset = queryset.filter(description__icontains=desc_query)
        return queryset.order_by('-transaction_date')
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get reconciliation dashboard with summary and transactions"""
        # Get all transactions
        all_transactions = ReconciliationTransaction.objects.all().order_by('-transaction_date')
        
        # Calculate summary statistics
        total_count = all_transactions.count()
        total_value = all_transactions.aggregate(Sum('amount'))['amount__sum'] or 0
        
        reconciled_count = all_transactions.filter(status='Reconciled').count()
        unreconciled_count = all_transactions.filter(status='Unreconciled').count()
        pending_count = all_transactions.filter(status='Pending').count()
        
        # Get status distribution
        status_distribution = all_transactions.values('status').annotate(
            count=Count('transaction_id')
        ).order_by('status')
        
        distribution = list(status_distribution)
        
        # Format transactions for the response
        transactions_list = []
        for txn in all_transactions:
            transactions_list.append({
                'transactionId': txn.transaction_id,
                'description': txn.description,
                'amount': float(txn.amount),
                'transactionDate': txn.transaction_date.isoformat() if txn.transaction_date else None,
                'status': txn.status,
            })
        
        return Response({
            'summary': {
                'totalValue': float(total_value),
                'totalCount': total_count,
                'reconciledCount': reconciled_count,
                'unreconciledCount': unreconciled_count,
                'pendingCount': pending_count,
                'distribution': distribution
            },
            'transactions': transactions_list
        })

# ===== REPAYMENT VIEWS =====
class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        queryset = Repayment.objects.all()
        status_filter = self.request.query_params.get('status')
        date_from = self.request.query_params.get('dateFrom')
        date_to = self.request.query_params.get('dateTo')
        search = self.request.query_params.get('searchQuery')
        
        if status_filter and status_filter != 'ALL_REPAYMENTS':
            queryset = queryset.filter(status=status_filter)
        if date_from:
            queryset = queryset.filter(due_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(due_date__lte=date_to)
        if search:
            queryset = queryset.filter(borrower_name__icontains=search)
        return queryset.order_by('-due_date')
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get repayment dashboard metrics"""
        from django.utils import timezone
        from datetime import datetime
        
        # Get all repayments
        all_repayments = Repayment.objects.select_related('loan').order_by('-due_date')
        
        # Calculate KPIs
        total_due = Repayment.objects.aggregate(
            total=Sum('amount_due')
        )['total'] or 0
        
        # Collected this month
        current_month_start = timezone.now().date().replace(day=1)
        next_month = (current_month_start + timezone.timedelta(days=32)).replace(day=1)
        paid_this_month = Repayment.objects.filter(
            status='Paid',
            paid_date__gte=current_month_start,
            paid_date__lt=next_month
        ).aggregate(Sum('amount_due'))['amount_due__sum'] or 0
        
        # Overdue metrics
        overdue_repayments = Repayment.objects.filter(
            status='Overdue',
        )
        overdue_amount = overdue_repayments.aggregate(
            total=Sum('amount_due')
        )['total'] or 0
        overdue_count = overdue_repayments.count()
        
        # Collection rate (paid vs target)
        paid_amount = Repayment.objects.filter(status='Paid').aggregate(
            total=Sum('amount_due')
        )['total'] or 0
        collection_rate = (paid_amount / total_due * 100) if total_due > 0 else 0
        
        # Format all repayments for the table
        repayments_list = []
        for repayment in all_repayments:
            repayments_list.append({
                'repaymentId': repayment.repayment_id,
                'loanId': repayment.loan.loan_id if repayment.loan else None,
                'borrowerName': repayment.borrower_name,
                'amountDue': float(repayment.amount_due),
                'dueDate': repayment.due_date.isoformat() if repayment.due_date else None,
                'status': repayment.status,
                'repaymentType': repayment.repayment_type,
                'paidDate': repayment.paid_date.isoformat() if repayment.paid_date else None,
            })
        
        # Status distribution for charts
        status_distribution = Repayment.objects.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        status_with_colors = []
        color_map = {
            'Paid': '#10b981',
            'Pending': '#f59e0b',
            'Overdue': '#ef4444'
        }
        
        for item in status_distribution:
            status_with_colors.append({
                'status': item['status'],
                'count': item['count'],
                'color': color_map.get(item['status'], '#6b7280')
            })
        
        return Response({
            'totalRecords': all_repayments.count(),
            'kpis': {
                'totalDue': {
                    'value': float(total_due)
                },
                'collectedThisMonth': {
                    'value': float(paid_this_month),
                    'trend': 5  # Placeholder trend
                },
                'overdueAmount': {
                    'value': float(overdue_amount),
                    'overdueCount': overdue_count
                },
                'collectionRate': {
                    'value': round(collection_rate, 2)
                }
            },
            'repayments': repayments_list,
            'statusDistribution': status_with_colors
        })
    
    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        """Record a payment for a repayment"""
        repayment = self.get_object()
        amount = request.data.get('amount')
        
        if not amount:
            return Response(
                {'error': 'Amount is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment = PaymentRecord.objects.create(
            repayment=repayment,
            amount=amount
        )
        
        # Check if fully paid
        total_paid = repayment.payments.aggregate(
            Sum('amount')
        )['amount__sum'] or 0
        
        if total_paid >= repayment.amount_due:
            repayment.status = 'Paid'
            repayment.paid_date = datetime.now().date()
            repayment.save()
        
        return Response({
            'repaymentId': repayment.repayment_id,
            'recordedAmount': float(amount),
            'totalPaid': float(total_paid),
            'status': repayment.status
        })
    
    @action(detail=True, methods=['post'])
    def send_reminder(self, request, pk=None):
        """Send a reminder for a repayment"""
        repayment = self.get_object()
        method = request.data.get('method', 'email')
        
        reminder = Reminder.objects.create(
            repayment=repayment,
            method=method
        )
        
        return Response({
            'message': f'Reminder sent for {repayment.repayment_id}',
            'method': method
        })

# ===== PAYMENT RECORD VIEWS =====
class PaymentRecordViewSet(viewsets.ModelViewSet):
    queryset = PaymentRecord.objects.all()
    serializer_class = PaymentRecordSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        repayment_id = self.request.query_params.get('repayment_id')
        queryset = PaymentRecord.objects.all()
        if repayment_id:
            queryset = queryset.filter(repayment_id=repayment_id)
        return queryset.order_by('-recorded_at')

# ===== REMINDER VIEWS =====
class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        repayment_id = self.request.query_params.get('repayment_id')
        queryset = Reminder.objects.all()
        if repayment_id:
            queryset = queryset.filter(repayment_id=repayment_id)
        return queryset.order_by('-sent_at')

# Legacy endpoint compatibility
class DashboardView(views.APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get(self, request):
        from datetime import datetime, timedelta
        from collections import defaultdict
        
        latest_dashboard = Dashboard.objects.order_by('-created_at').first()

        # Calculate disbursement trends (last 6 months)
        six_months_ago = datetime.now().date() - timedelta(days=180)
        
        # Group disbursements by month
        disbursements = Disbursement.objects.filter(date__gte=six_months_ago).order_by('date')
        disbursement_by_month = defaultdict(float)
        
        for d in disbursements:
            month_name = d.date.strftime('%b')
            disbursement_by_month[month_name] += float(d.amount)
        
        disbursement_trends = []
        for month, total in disbursement_by_month.items():
            disbursement_trends.append({
                'month': month,
                'disbursed': round(total / 1_000_000, 2)
            })
        
        # Calculate collection performance
        repayments = Repayment.objects.filter(due_date__gte=six_months_ago).order_by('due_date')
        collection_by_month = defaultdict(lambda: {'expected': 0, 'actual': 0})
        
        for r in repayments:
            month_name = r.due_date.strftime('%b')
            collection_by_month[month_name]['expected'] += float(r.amount_due)
            if r.status == 'Paid' and r.paid_date:
                collection_by_month[month_name]['actual'] += float(r.amount_due)
        
        collection_performance = []
        for month, values in collection_by_month.items():
            collection_performance.append({
                'month': month,
                'expected': round(values['expected'] / 1_000_000, 2),
                'actual': round(values['actual'] / 1_000_000, 2)
            })
        
        # Payment status distribution
        total_repayments = Repayment.objects.count()
        status_counts = Repayment.objects.values('status').annotate(count=Count('id'))
        
        status_colors = {
            'Paid': '#10b981',
            'Pending': '#f59e0b',
            'Overdue': '#ef4444'
        }
        
        payment_status_distribution = []
        for item in status_counts:
            percentage = (item['count'] / total_repayments * 100) if total_repayments > 0 else 0
            payment_status_distribution.append({
                'status': item['status'],
                'value': round(percentage, 1),
                'color': status_colors.get(item['status'], '#6b7280')
            })
        
        # Loan portfolio composition (generic since no loan_type field)
        total_loans = Loan.objects.count()
        paid_loans = Loan.objects.filter(disbursement__status='Paid').distinct().count()
        pending_loans = total_loans - paid_loans
        
        loan_portfolio_composition = []
        if total_loans > 0:
            if paid_loans > 0:
                loan_portfolio_composition.append({
                    'type': 'Active Loans',
                    'value': round((paid_loans / total_loans * 100), 1),
                    'color': '#1d4ed8'
                })
            if pending_loans > 0:
                loan_portfolio_composition.append({
                    'type': 'Pending Loans',
                    'value': round((pending_loans / total_loans * 100), 1),
                    'color': '#f59e0b'
                })
        
        # Recent activity (last 5 disbursements)
        recent_disbursements = Disbursement.objects.order_by('-date')[:5]
        recent_activity = []
        
        for d in recent_disbursements:
            recent_activity.append({
                'id': str(d.disbursement_id),
                'status': 'success' if d.status == 'Paid' else 'warning' if d.status == 'Pending' else 'error',
                'title': f'Disbursement {d.status}',
                'entity': d.recipient_name,
                'timestamp': d.date.isoformat() + 'T00:00:00Z'
            })

        if latest_dashboard:
            return Response({
                'kpis': {
                    'totalDisbursed': {
                        'value': float(latest_dashboard.total_disbursed),
                        'trend': 0
                    },
                    'pendingDisbursement': {
                        'value': float(latest_dashboard.pending_disbursement),
                        'trend': 0
                    },
                    'collectionRate': {
                        'value': float(latest_dashboard.collection_rate) / 100.0,
                        'trend': 0
                    },
                    'overdueAmount': {
                        'value': float(latest_dashboard.overdue_amount),
                        'trend': 0
                    }
                },
                'disbursementTrends': disbursement_trends,
                'collectionPerformance': collection_performance,
                'paymentStatusDistribution': payment_status_distribution,
                'loanPortfolioComposition': loan_portfolio_composition,
                'recentActivity': recent_activity
            })

        total_disbursed = Disbursement.objects.filter(
            status='Paid'
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        pending_disbursement = Disbursement.objects.filter(
            status='Pending'
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        overdue_amount = Repayment.objects.filter(
            status='Overdue'
        ).aggregate(Sum('amount_due'))['amount_due__sum'] or 0

        paid_repayments = Repayment.objects.filter(status='Paid').aggregate(
            total=Sum('amount_due')
        )['total'] or 0
        total_repayment_due = Repayment.objects.aggregate(
            total=Sum('amount_due')
        )['total'] or 0
        collection_rate = (paid_repayments / total_repayment_due) if total_repayment_due > 0 else 0

        return Response({
            'kpis': {
                'totalDisbursed': {
                    'value': float(total_disbursed),
                    'trend': 0
                },
                'pendingDisbursement': {
                    'value': float(pending_disbursement),
                    'trend': 0
                },
                'collectionRate': {
                    'value': float(collection_rate),
                    'trend': 0
                },
                'overdueAmount': {
                    'value': float(overdue_amount),
                    'trend': 0
                }
            },
            'disbursementTrends': disbursement_trends,
            'collectionPerformance': collection_performance,
            'paymentStatusDistribution': payment_status_distribution,
            'loanPortfolioComposition': loan_portfolio_composition,
            'recentActivity': recent_activity
        })

class DisbursementDashboardView(views.APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get(self, request):
        disbursement_viewset = DisbursementViewSet()
        disbursement_viewset.request = request
        return disbursement_viewset.dashboard(request)

class ReconciliationListView(views.APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get(self, request):
        viewset = ReconciliationTransactionViewSet()
        viewset.request = request
        queryset = viewset.get_queryset()
        serializer = ReconciliationTransactionSerializer(queryset, many=True)
        return Response({'transactions': serializer.data})
    
    def post(self, request):
        updates = request.data.get('updates', [])
        for update in updates:
            try:
                txn = ReconciliationTransaction.objects.get(
                    transaction_id=update['transaction_id']
                )
                txn.status = update.get('status', txn.status)
                txn.save()
            except ReconciliationTransaction.DoesNotExist:
                pass
        return Response({'updated': updates})

class RepaymentListView(views.APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get(self, request):
        viewset = RepaymentViewSet()
        viewset.request = request
        queryset = viewset.get_queryset()
        serializer = RepaymentSerializer(queryset, many=True)
        return Response({'repayments': serializer.data})

class RecordPaymentView(views.APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def post(self, request, repayment_id):
        try:
            repayment = Repayment.objects.get(repayment_id=repayment_id)
            viewset = RepaymentViewSet()
            viewset.request = request
            return viewset.record_payment(request, pk=repayment.id)
        except Repayment.DoesNotExist:
            return Response(
                {'error': 'Repayment not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class SendReminderView(views.APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def post(self, request, repayment_id):
        try:
            repayment = Repayment.objects.get(repayment_id=repayment_id)
            viewset = RepaymentViewSet()
            viewset.request = request
            return viewset.send_reminder(request, pk=repayment.id)
        except Repayment.DoesNotExist:
            return Response(
                {'error': 'Repayment not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class GenerateReportView(views.APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Generate a comprehensive finance summary report"""
        from datetime import datetime
        
        # Gather all data
        total_loans = Loan.objects.count()
        total_disbursed = Disbursement.objects.filter(status='Paid').aggregate(Sum('amount'))['amount__sum'] or 0
        pending_disbursements = Disbursement.objects.filter(status='Pending').aggregate(Sum('amount'))['amount__sum'] or 0
        total_repayments_due = Repayment.objects.aggregate(Sum('amount_due'))['amount_due__sum'] or 0
        paid_repayments = Repayment.objects.filter(status='Paid').aggregate(Sum('amount_due'))['amount_due__sum'] or 0
        overdue_amount = Repayment.objects.filter(status='Overdue').aggregate(Sum('amount_due'))['amount_due__sum'] or 0
        
        collection_rate = (paid_repayments / total_repayments_due * 100) if total_repayments_due > 0 else 0
        
        report_data = {
            'generatedAt': datetime.now().isoformat(),
            'reportType': 'Finance Summary',
            'summary': {
                'totalLoans': total_loans,
                'totalDisbursed': float(total_disbursed),
                'pendingDisbursements': float(pending_disbursements),
                'totalRepaymentsDue': float(total_repayments_due),
                'totalRepaymentsPaid': float(paid_repayments),
                'overdueAmount': float(overdue_amount),
                'collectionRate': round(collection_rate, 2),
            },
            'disbursementSummary': {
                'total': Disbursement.objects.count(),
                'paid': Disbursement.objects.filter(status='Paid').count(),
                'pending': Disbursement.objects.filter(status='Pending').count(),
                'failed': Disbursement.objects.filter(status='Failed').count(),
            },
            'repaymentSummary': {
                'total': Repayment.objects.count(),
                'paid': Repayment.objects.filter(status='Paid').count(),
                'pending': Repayment.objects.filter(status='Pending').count(),
                'overdue': Repayment.objects.filter(status='Overdue').count(),
            }
        }
        
        return Response({
            'status': 'success',
            'message': 'Finance Summary Report generated',
            'reportData': report_data,
            'downloadUrl': '/api/v1/finance/report/download'
        })


class ListReportsView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """List available reports"""
        reports = [
            {
                'id': 'finance-summary',
                'name': 'Finance Summary Report',
                'description': 'Comprehensive overview of loans, disbursements, and repayments',
                'type': 'PDF',
                'generatedAt': None,
                'downloadUrl': '/api/v1/finance/report/generate'
            },
            {
                'id': 'repayments-xlsx',
                'name': 'Repayments Report',
                'description': 'Detailed list of all repayments with status and dates',
                'type': 'XLSX',
                'downloadUrl': '/api/v1/finance/repayments/report/download'
            },
            {
                'id': 'disbursements-xlsx',
                'name': 'Disbursements Report',
                'description': 'Detailed list of all disbursements with payment methods',
                'type': 'XLSX',
                'downloadUrl': '/api/v1/finance/disbursements/report/download'
            }
        ]
        
        return Response({
            'status': 'success',
            'totalReports': len(reports),
            'reports': reports
        })


class DownloadRepaymentsReportView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Download repayments as CSV"""
        repayments = Repayment.objects.all().order_by('-due_date')
        csv_content = 'Repayment ID,Borrower Name,Loan ID,Amount Due,Due Date,Status,Repayment Type,Paid Date\n'
        for r in repayments:
            loan_id = r.loan.loan_id if r.loan else 'N/A'
            paid_date = r.paid_date.strftime('%Y-%m-%d') if r.paid_date else ''
            csv_content += f'"{r.repayment_id}","{r.borrower_name}","{loan_id}",{r.amount_due},"{r.due_date.strftime("%Y-%m-%d")}","{r.status}","{r.repayment_type}","{paid_date}"\n'
        
        response = Response(csv_content, content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="repayments-{datetime.now().strftime("%Y%m%d")}.csv"'
        return response


class DownloadDisbursementsReportView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Download disbursements as CSV"""
        disbursements = Disbursement.objects.all().order_by('-date')
        csv_content = 'Disbursement ID,Loan ID,Recipient Name,Amount,Date,Status,Payment Method\n'
        for d in disbursements:
            loan_id = d.loan.loan_id if d.loan else 'N/A'
            csv_content += f'"{d.disbursement_id}","{loan_id}","{d.recipient_name}",{d.amount},"{d.date.strftime("%Y-%m-%d")}","{d.status}","{d.payment_method}"\n'
        
        response = Response(csv_content, content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="disbursements-{datetime.now().strftime("%Y%m%d")}.csv"'
        return response
