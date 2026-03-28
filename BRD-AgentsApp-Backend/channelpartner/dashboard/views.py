from rest_framework import views, permissions, response
from channelpartner.leads.models import Lead
from channelpartner.payouts.models import Payout
from channelpartner.accounts.models import User
from django.db.models import Sum
from channelpartner.leads.serializers import LeadSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        role = (getattr(user, 'role', '') or '').upper().replace(' ', '_')
        if role in ('CHANNEL_PARTENER', 'CHANNEL_PARTNER'):
            role = 'PARTNER'

        data = {'role': role}

        if role == 'ADMIN':
            data['total_users'] = User.objects.count()
            data['total_disbursed'] = Payout.objects.aggregate(Sum('disbursed_amount'))['disbursed_amount__sum'] or 0
            data['total_commissions_paid'] = Payout.objects.filter(status='PAID').aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0
            data['active_leads'] = Lead.objects.exclude(status__in=['REJECTED', 'SANCTIONED']).count()

        elif role == 'PARTNER':
            # Works even when authenticated user comes from a different auth model.
            leads = Lead.objects.filter(partner__email=user.email)
            payouts = Payout.objects.filter(partner__email=user.email)

            data['total_leads'] = leads.count()
            data['active_leads'] = leads.filter(status='ACTIVE').count()
            data['converted_leads'] = leads.filter(status='SANCTIONED').count()

            total_earnings = payouts.filter(status__in=['PAID', 'PENDING']).aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0
            paid_earnings = payouts.filter(status='PAID').aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0
            pending_earnings = payouts.filter(status='PENDING').aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0

            from django.utils import timezone
            now = timezone.now()
            month_earnings = payouts.filter(created_at__year=now.year, created_at__month=now.month).aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0

            data['total_earnings'] = total_earnings
            data['paid_earnings'] = paid_earnings
            data['pending_earnings'] = pending_earnings
            data['month_earnings'] = month_earnings
            data['growth_percentage'] = 12.5
            data['conversion_ratio'] = round((data['converted_leads'] / data['total_leads']) * 100, 2) if data['total_leads'] > 0 else 0
            data['recent_leads'] = LeadSerializer(leads.order_by('-created_at')[:5], many=True).data

        elif role == 'CREDIT_OPS':
            assigned_leads = Lead.objects.filter(credit_ops__email=user.email)
            data['assigned_leads'] = assigned_leads.count()
            data['processed_leads'] = assigned_leads.exclude(status__in=['ACTIVE', 'UNDER_REVIEW']).count()
            data['recent_leads'] = LeadSerializer(assigned_leads.order_by('-updated_at')[:5], many=True).data

        else:
            data.update({
                'total_leads': 0,
                'active_leads': 0,
                'converted_leads': 0,
                'total_earnings': 0,
                'paid_earnings': 0,
                'pending_earnings': 0,
                'month_earnings': 0,
                'conversion_ratio': 0,
                'growth_percentage': 0,
                'recent_leads': [],
                'warning': 'Unsupported role for channel partner dashboard stats.',
            })

        return response.Response(data)



class HomeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Leads Count
        total_leads = Lead.objects.filter(created_by=user).count()
        active_leads = Lead.objects.filter(created_by=user, status='ACTIVE').count()
        converted_leads = Lead.objects.filter(created_by=user, status='CONVERTED').count()

        # Earnings
        total_earnings = Payout.objects.filter(user=user, status='PAID') \
                                       .aggregate(total=Sum('amount'))['total'] or 0

        pending_payout = Payout.objects.filter(user=user, status='PENDING') \
                                       .aggregate(total=Sum('amount'))['total'] or 0

        # Recent Leads
        recent_leads = Lead.objects.filter(created_by=user).order_by('-created_at')[:5]

        recent_data = []
        for lead in recent_leads:
            recent_data.append({
                "id": lead.id,
                "name": lead.name,
                "loan_type": lead.loan_type,
                "amount": lead.amount,
                "status": lead.status,
            })

        return Response({
            "total_leads": total_leads,
            "active_leads": active_leads,
            "converted_leads": converted_leads,

            "total_earnings": total_earnings,
            "pending_payout": pending_payout,

            "quick_actions": [
                {"name": "New Lead", "route": "/new-lead"},
                {"name": "Track Status", "route": "/track"},
                {"name": "Payouts", "route": "/payouts"},
                {"name": "Invoices", "route": "/invoices"},
            ],

            "recent_leads": recent_data
        })
