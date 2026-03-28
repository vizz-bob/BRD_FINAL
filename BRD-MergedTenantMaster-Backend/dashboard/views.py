from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from calendar import monthrange
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes


# Import models
from tenants.models import Tenant
from auth_service.accounts.models import User
from tenantuser.models import TenantUser
from los.models import LoanApplication, CreditAssessment
from disbursement.models import LoanAccount as DisbursementLoanAccount
from lms.models import LoanAccount as LmsLoanAccount


@api_view(['GET'])
@permission_classes([AllowAny])
def kpis_and_charts(request):
    """
    Returns KPI metrics and chart data for the dashboard
    """
    try:
        kpis = get_kpis()
        charts = get_charts()
        
        return Response({
            'success': True,
            'kpis': kpis,
            'charts': charts
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_kpis():
    """
    Aggregates KPI data from models
    """
    # Total active tenants
    total_tenants = Tenant.objects.filter(is_active=True).count()
    
    # Active users (both platform and tenant users)
    active_platform_users = User.objects.filter(
        is_active=True
    ).count()
    
    active_tenant_users = TenantUser.objects.filter(
        is_active=True,
        account_status='ACTIVE'
    ).count()
    
    active_users = active_platform_users + active_tenant_users
    
    # Total loans
    total_loans = LoanApplication.objects.count()
    
    # Total disbursed amount (sum of all completed disbursements)
    disbursed_amount = DisbursementLoanAccount.objects.filter(
        disbursement_status='COMPLETED'
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    # Alternative: Include LMS loan accounts if they have separate disbursement tracked
    # (LMS LoanAccount does not have a disbursement_status field; use disbursed_at instead)
    lms_disbursed = LmsLoanAccount.objects.filter(
        disbursed_at__isnull=False
    ).aggregate(total=Sum('outstanding_principal'))['total'] or 0
    
    # Combine both sources
    total_disbursed = disbursed_amount + lms_disbursed
    
    return {
        'totalTenants': total_tenants,
        'activeUsers': active_users,
        'totalLoans': total_loans,
        'disbursedAmount': total_disbursed
    }


def get_charts():
    """
    Generates chart data for the dashboard
    """
    return {
        'monthlyDisbursement': get_monthly_disbursement(),
        'loanStatusDistribution': get_loan_status_distribution()
    }


def get_monthly_disbursement():
    """
    Returns monthly disbursement data for the past 12 months
    """
    monthly_data = []
    today = datetime.now()
    
    # Generate data for the past 12 months
    for i in range(11, -1, -1):
        # Calculate first and last day of the month
        current_date = today.replace(day=1) - timedelta(days=i*30)
        first_day = current_date.replace(day=1)
        last_day = current_date.replace(day=monthrange(current_date.year, current_date.month)[1])
        
        # Sum disbursements for the month
        month_amount = DisbursementLoanAccount.objects.filter(
            disbursement_status='COMPLETED',
            created_at__date__gte=first_day.date(),
            created_at__date__lte=last_day.date()
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        month_name = first_day.strftime('%b')
        monthly_data.append({
            'month': month_name,
            'amount': month_amount
        })
    
    return monthly_data


def get_loan_status_distribution():
    """
    Returns loan status distribution across all statuses
    """
    # Get approved loans (from CreditAssessment)
    approved_loans = CreditAssessment.objects.filter(
        status__in=['SYSTEM_APPROVED', 'MANUAL_APPROVED']
    ).count()
    
    # Get rejected loans
    rejected_loans = CreditAssessment.objects.filter(
        status__in=['SYSTEM_REJECTED', 'MANUAL_REJECTED']
    ).count()
    
    # Get pending loans (applications without assessment or pending assessment)
    pending_loans = LoanApplication.objects.filter(
        credit_assessment__isnull=True
    ).count()
    
    # Get disbursed/active loans
    active_loans = DisbursementLoanAccount.objects.filter(
        disbursement_status='COMPLETED'
    ).count()
    
    return [
        {'status': 'Active', 'count': active_loans},
        {'status': 'Approved', 'count': approved_loans},
        {'status': 'Rejected', 'count': rejected_loans},
        {'status': 'Pending', 'count': pending_loans}
    ]