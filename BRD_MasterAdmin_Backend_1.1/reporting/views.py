from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
import datetime

from .models import Report, Analytics
from .serializers import ReportSerializer, AnalyticsSerializer
from users.permissions import DefaultPermission
from tenants.models import Tenant, Branch
from django.contrib.auth import get_user_model  # ✅ Use get_user_model
from los.models import LoanApplication
from lms.models import LoanAccount, Repayment
from crm.models import LeadActivity

User = get_user_model() # ✅ Correct way to get User model

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [DefaultPermission]

class AnalyticsViewSet(viewsets.ModelViewSet):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [DefaultPermission]

# --- 1. DASHBOARD ---
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_tenants = Tenant.objects.count()
        total_branches = Branch.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        total_loans = LoanApplication.objects.count()
        
        disbursed_agg = LoanApplication.objects.filter(status='DISBURSED').aggregate(Sum('amount'))
        disbursed_amount = disbursed_agg['amount__sum'] or 0
        
        if disbursed_amount > 10000000:
            disbursed_display = f"₹{disbursed_amount/10000000:.2f} Cr"
        else:
            disbursed_display = f"₹{disbursed_amount:,.0f}"

        status_counts = LoanApplication.objects.values('status').annotate(count=Count('id'))
        pie_data = [{"status": item['status'], "count": item['count']} for item in status_counts]

        monthly_data = (
            LoanApplication.objects.filter(status='DISBURSED')
            .annotate(month=TruncMonth('updated_at'))
            .values('month')
            .annotate(amount=Sum('amount'))
            .order_by('month')
        )
        line_chart_data = [
            {"month": m['month'].strftime('%b'), "amount": m['amount']} 
            for m in monthly_data
        ]

        recent_activities = LeadActivity.objects.select_related('lead').order_by('-created_at')[:5]
        activity_feed = [
            {
                "title": action.action,
                "subtitle": action.lead.name if action.lead else "System",
                "time": action.created_at.strftime('%Y-%m-%d %H:%M')
            }
            for action in recent_activities
        ]

        branch_users = User.objects.values('branch__name').annotate(users=Count('id'))
        users_per_branch_data = [
            {"label": item['branch__name'] or "Head Office", "users": item['users']}
            for item in branch_users
        ]

        alerts_data = [
            {"type": "Critical", "message": "High server load detected", "time": "10 mins ago"},
            {"type": "Warning", "message": "3 Loan applications pending > 24hrs", "time": "2 hours ago"},
            {"type": "Info", "message": "System backup completed successfully", "time": "5 hours ago"},
        ]

        data = {
            "kpis": {
                "totalTenants": total_tenants,
                "totalBranches": total_branches,
                "activeUsers": active_users,
                "totalLoans": total_loans,
                "disbursedAmount": disbursed_display,
                "apiStatus": "Online"
            },
            "charts": {
                "monthlyDisbursement": line_chart_data,
                "loanStatusDistribution": pie_data,
                "recentActivity": activity_feed,
                "usersPerBranch": users_per_branch_data
            },
            "alerts": alerts_data
        }
        return Response(data)

# --- 2. DAILY DISBURSEMENT ---
class DailyDisbursementReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        branch_id = request.query_params.get('branch')

        queryset = LoanApplication.objects.filter(status='DISBURSED')

        if start_date:
            queryset = queryset.filter(updated_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(updated_at__date__lte=end_date)
        if branch_id and branch_id != 'all':
            queryset = queryset.filter(branch__id=branch_id)

        report_data = (
            queryset
            .annotate(date=TruncDate('updated_at'))
            .values('date', 'branch__name')
            .annotate(
                total_amount=Sum('amount'),
                total_loans=Count('id')
            )
            .order_by('-date')
        )

        formatted_data = [
            {
                "date": item['date'].strftime('%Y-%m-%d'),
                "branch": item['branch__name'] or "Head Office",
                "amount": f"₹{item['total_amount']:,.0f}",
                "loans": item['total_loans']
            }
            for item in report_data
        ]
        
        return Response(formatted_data)

# --- 3. BRANCH PERFORMANCE ---
class BranchPerformanceReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        branches = Branch.objects.all()
        data = []
        for branch in branches:
            loans = LoanApplication.objects.filter(branch=branch)
            disbursed_loans = loans.filter(status='DISBURSED')
            total_disbursed = disbursed_loans.aggregate(Sum('amount'))['amount__sum'] or 0
            count = disbursed_loans.count()
            
            npa_count = loans.filter(status='REJECTED').count()
            npa_percent = round((npa_count / loans.count() * 100), 1) if loans.count() > 0 else 0

            collections_agg = Repayment.objects.filter(loan_account__loan_application__branch=branch).aggregate(Sum('amount'))
            total_collections = collections_agg['amount__sum'] or 0

            data.append({
                "branch": branch.name,
                "loans": count,
                "disbursed": f"₹{total_disbursed:,.0f}",
                "collections": f"₹{total_collections:,.0f}",
                "npa": f"{npa_percent}%",
                "rating": "Excellent" if npa_percent < 5 else "Good"
            })
            
        return Response(data)

# --- 4. LOAN APPROVAL REPORT ---
class LoanApprovalReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_applied = LoanApplication.objects.count()
        total_approved = LoanApplication.objects.filter(status__in=['APPROVED', 'DISBURSED']).count()
        total_rejected = LoanApplication.objects.filter(status='REJECTED').count()
        
        approved_pct = f"{round((total_approved/total_applied)*100, 1)}%" if total_applied > 0 else "0%"
        rejected_pct = f"{round((total_rejected/total_applied)*100, 1)}%" if total_applied > 0 else "0%"

        status_data = []
        status_data.append({
            "loanType": "All Loans",
            "applied": total_applied,
            "approved": total_approved,
            "rejected": total_rejected,
            "approvalRate": approved_pct
        })

        rejection_reasons = [
            {"reason": "Credit Policy Mismatch", "count": int(total_rejected * 0.4), "percentage": "40%"},
            {"reason": "Low Income", "count": int(total_rejected * 0.3), "percentage": "30%"},
            {"reason": "Document Issues", "count": int(total_rejected * 0.3), "percentage": "30%"},
        ]

        data = {
            "statusData": status_data,
            "rejectionReasons": rejection_reasons,
            "overall": {
                "total": total_applied,
                "approved": total_approved,
                "rejected": total_rejected,
                "approved_pct": approved_pct,
                "rejected_pct": rejected_pct
            }
        }
        return Response(data)

# --- 5. NPA REPORT ---
class NPAReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        three_months_ago = timezone.now() - datetime.timedelta(days=90)
        
        potential_npa_accounts = LoanAccount.objects.filter(
            created_at__lte=three_months_ago, 
            outstanding_principal__gt=0
        )
        
        npa_count = potential_npa_accounts.count()
        npa_amount_agg = potential_npa_accounts.aggregate(Sum('outstanding_principal'))
        npa_total_amount = npa_amount_agg['outstanding_principal__sum'] or 0

        npa_by_branch_qs = (
            potential_npa_accounts
            .values('loan_application__branch__name')
            .annotate(count=Count('id'), amount=Sum('outstanding_principal'))
        )

        npa_by_branch = [
            {
                "branch": item['loan_application__branch__name'] or "Head Office",
                "count": item['count'],
                "amount": f"₹{item['amount']/100000:.2f} L",
                "rate": "High"
            }
            for item in npa_by_branch_qs
        ]

        npa_by_category = [
            {"category": "General NPA", "desc": ">90 days overdue", "count": npa_count, "amount": f"₹{npa_total_amount:,.0f}", "pct": "100%"},
        ]

        data = {
            "npaByCategory": npa_by_category,
            "npaByBranch": npa_by_branch,
            "kpi": {
                "count": npa_count,
                "amount": f"₹{npa_total_amount:,.0f}",
                "ratio": "Calculated based on old loans",
                "recovery": "0%"
            }
        }
        return Response(data)

# --- 6. REVENUE REPORT ---
class RevenueReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_collections = Repayment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        
        revenue_sources = [
            {"source": "Loan Repayments", "amount": f"₹{total_collections:,.0f}", "pct": "100%", "growth": "Variable"},
        ]
        
        monthly_revenue = (
            Repayment.objects
            .annotate(month=TruncMonth('paid_at'))
            .values('month')
            .annotate(revenue=Sum('amount'))
            .order_by('month')
        )

        monthly = [
            {
                "month": m['month'].strftime('%b'), 
                "revenue": f"₹{m['revenue']:,.0f}", 
                "target": "₹0", 
                "achieved": "N/A"
            } 
            for m in monthly_revenue
        ]

        data = {
            "sources": revenue_sources,
            "monthly": monthly,
            "summary": {
                "total": f"₹{total_collections:,.0f}",
                "avg": "N/A",
                "target": "N/A",
                "growth": "N/A"
            }
        }
        return Response(data)

# --- 7. USER ACTIVITY REPORT (FIXED) ---
class UserActivityReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        activity_data = []
        
        for u in users:
            apps_count = LoanApplication.objects.filter(created_by=u).count()
            actions_count = LeadActivity.objects.filter(user=u).count()
            
            # ✅ ERROR FIX: 'u.email' use kar rahe hain kyunki 'first_name' nahi hai
            user_display_name = u.email 
            
            activity_data.append({
                "user": user_display_name,
                "role": u.role,
                "logins": "N/A",
                "applications": apps_count,
                "approvals": 0,
                "lastActive": u.last_login.strftime('%Y-%m-%d') if u.last_login else "Never"
            })

        total_loans = LoanApplication.objects.count()
        total_activities = LeadActivity.objects.count()

        system_usage = [
            {"feature": "Loan Applications", "usage": total_loans, "trend": "Live"},
            {"feature": "CRM Activities", "usage": total_activities, "trend": "Live"},
        ]

        data = {
            "users": activity_data,
            "usage": system_usage,
            "kpi": {
                "active": users.filter(is_active=True).count(),
                "sessions": "N/A",
                "avgTime": "N/A",
                "actions": total_activities
            }
        }
        return Response(data)