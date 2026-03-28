from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Count, Avg, Sum, Q, F, ExpressionWrapper, DurationField
from django.db.models.functions import TruncWeek
from datetime import timedelta, date
import calendar

from .models import Lead, Reminder, Notification, TeamMember, Resource, LeadStage
from incentives.models import Incentive
from reports.models import Report

from .serializers import (
    LeadSerializer, LeadCreateSerializer,
    ReminderSerializer, NotificationSerializer, NotifyTeamSerializer,
    DashboardMetricsSerializer,
    ActiveLeadsReportSerializer, UserBasicSerializer, TeamMemberSerializer,
    ResourceSerializer
)


# ── Helper ─────────────────────────────────────────────────────────────────────

def get_lead_queryset_for_user(user, filter_type='all'):
    """Return leads queryset filtered by user role / filter type."""
    qs = Lead.objects.select_related('assigned_to', 'created_by')
    if filter_type == 'my':
        qs = qs.filter(assigned_to=user)
    elif filter_type == 'team':
        try:
            role = user.team_member.role
            if role in ('sales_executive', 'relationship_manager'):
                qs = qs.filter(assigned_to=user)
        except TeamMember.DoesNotExist:
            pass
    elif filter_type == 'pending_docs':
        qs = qs.filter(stage=LeadStage.DOCS_PENDING)
    elif filter_type == 'payout_due':
        qs = qs.filter(stage=LeadStage.DISBURSED, is_active=True)
    return qs


# ── Dashboard ViewSet ──────────────────────────────────────────────────────────

class DashboardViewSet(viewsets.ViewSet):
    """
    Home dashboard metrics, focused metric detail, and quick actions.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='metrics')
    def metrics(self, request):
        """
        GET /api/dashboard/metrics/?filter=all|my|team|pending_docs|payout_due
        Returns the 4 KPI cards shown on the Sales Team Dashboard.
        """
        filter_type = request.query_params.get('filter', 'all')
        now = timezone.now()
        one_week_ago = now - timedelta(days=7)
        two_weeks_ago = now - timedelta(days=14)

        qs = get_lead_queryset_for_user(request.user, filter_type)

        # Active leads (in-progress)
        active_qs = qs.filter(is_active=True).exclude(
            stage__in=[LeadStage.DISBURSED, LeadStage.REJECTED]
        )
        active_leads = active_qs.count()

        # vs last week
        active_last_week = qs.filter(
            is_active=True,
            created_at__lt=one_week_ago,
            created_at__gte=two_weeks_ago
        ).exclude(stage__in=[LeadStage.DISBURSED, LeadStage.REJECTED]).count()

        if active_last_week > 0:
            change_pct = round(((active_leads - active_last_week) / active_last_week) * 100, 1)
        else:
            change_pct = 100.0 if active_leads > 0 else 0.0

        # Lead → Application conversion
        total_leads = qs.filter(created_at__gte=one_week_ago).count()
        applied_leads = qs.filter(
            created_at__gte=one_week_ago,
            stage__in=[LeadStage.APPLICATION, LeadStage.DOCS_PENDING,
                       LeadStage.APPROVED, LeadStage.DISBURSED]
        ).count()
        lead_to_app_pct = round((applied_leads / total_leads * 100), 1) if total_leads > 0 else 0.0

        # Avg time to apply (hours)
        avg_duration = qs.filter(
            applied_at__isnull=False
        ).annotate(
            duration=ExpressionWrapper(
                F('applied_at') - F('created_at'), output_field=DurationField()
            )
        ).aggregate(avg=Avg('duration'))['avg']

        avg_hrs = round(avg_duration.total_seconds() / 3600, 1) if avg_duration else 38.0

        # Previous week avg for improvement calc
        prev_avg_duration = qs.filter(
            applied_at__isnull=False,
            created_at__lt=one_week_ago,
            created_at__gte=two_weeks_ago
        ).annotate(
            duration=ExpressionWrapper(
                F('applied_at') - F('created_at'), output_field=DurationField()
            )
        ).aggregate(avg=Avg('duration'))['avg']

        prev_avg_hrs = round(prev_avg_duration.total_seconds() / 3600, 1) if prev_avg_duration else avg_hrs
        improvement_hrs = round(prev_avg_hrs - avg_hrs, 1)

        # Monthly incentives for current user
        today = date.today()
        first_day = date(today.year, today.month, 1)
        incentive_total = Incentive.objects.filter(
            team_member=request.user,
            month=first_day
        ).aggregate(total=Sum('amount'))['total'] or 0

        data = {
            'active_leads': active_leads,
            'active_leads_change_pct': change_pct,
            'lead_to_application_pct': lead_to_app_pct,
            'lead_to_application_target': 60.0,
            'avg_time_to_apply_hrs': avg_hrs,
            'avg_time_improvement_hrs': improvement_hrs,
            'monthly_incentives': incentive_total,
        }
        serializer = DashboardMetricsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='report/(?P<metric>[^/.]+)')
    def metric_report(self, request, metric=None):
        """
        GET /api/dashboard/report/active_leads/
        Returns focused metric report data for the View Report modal.
        """
        filter_type = request.query_params.get('filter', 'all')
        qs = get_lead_queryset_for_user(request.user, filter_type)
        now = timezone.now()

        METRIC_MAP = {
            'active_leads': self._active_leads_report,
            'lead_to_application': self._conversion_report,
            'avg_time_to_apply': self._avg_time_report,
            'monthly_incentives': self._incentives_report,
        }

        handler = METRIC_MAP.get(metric)
        if not handler:
            return Response({'detail': f'Unknown metric: {metric}'}, status=404)

        return handler(request, qs, now)

    def _active_leads_report(self, request, qs, now):
        active_qs = qs.filter(is_active=True).exclude(
            stage__in=[LeadStage.DISBURSED, LeadStage.REJECTED]
        )
        weekly_data = []
        for i in range(6, -1, -1):
            week_start = now - timedelta(days=(i + 1) * 7)
            week_end = now - timedelta(days=i * 7)
            count = active_qs.filter(created_at__gte=week_start, created_at__lt=week_end).count()
            weekly_data.append({
                'week': week_start.strftime('%-d %b'),
                'count': count
            })

        data = {
            'current_value': active_qs.count(),
            'target_label': '+14% vs last week',
            'weekly_data': weekly_data,
        }
        return Response(data)

    def _conversion_report(self, request, qs, now):
        one_week_ago = now - timedelta(days=7)
        total = qs.filter(created_at__gte=one_week_ago).count()
        applied = qs.filter(
            created_at__gte=one_week_ago,
            stage__in=[LeadStage.APPLICATION, LeadStage.DOCS_PENDING,
                       LeadStage.APPROVED, LeadStage.DISBURSED]
        ).count()
        pct = round(applied / total * 100, 1) if total else 0
        return Response({'current_value': pct, 'target': 60, 'total_leads': total, 'applied': applied})

    def _avg_time_report(self, request, qs, now):
        avg = qs.filter(applied_at__isnull=False).annotate(
            dur=ExpressionWrapper(F('applied_at') - F('created_at'), output_field=DurationField())
        ).aggregate(avg=Avg('dur'))['avg']
        hrs = round(avg.total_seconds() / 3600, 1) if avg else 0
        return Response({'current_value': hrs, 'unit': 'hours'})

    def _incentives_report(self, request, qs, now):
        today = date.today()
        first_day = date(today.year, today.month, 1)
        total = Incentive.objects.filter(
            team_member=request.user, month=first_day
        ).aggregate(total=Sum('amount'))['total'] or 0
        return Response({'current_value': float(total), 'currency': 'INR'})


# ── Lead ViewSet ───────────────────────────────────────────────────────────────

class LeadViewSet(viewsets.ModelViewSet):
    """
    CRUD for Leads + nested follow-up actions:
      POST /api/leads/{id}/add_reminder/
      POST /api/leads/{id}/notify_team/
      GET  /api/leads/{id}/view_report/
      POST /api/leads/{id}/mark_applied/
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['borrower_name', 'contact_number', 'city_region']
    ordering_fields = ['created_at', 'updated_at', 'ticket_size']
    ordering = ['-created_at']

    def get_queryset(self):
        filter_type = self.request.query_params.get('filter', 'all')
        qs = get_lead_queryset_for_user(self.request.user, filter_type)

        stage = self.request.query_params.get('stage')
        if stage:
            qs = qs.filter(stage=stage)

        loan_product = self.request.query_params.get('loan_product')
        if loan_product:
            qs = qs.filter(loan_product=loan_product)

        return qs.prefetch_related('reminders', 'notifications')

    def get_serializer_class(self):
        if self.action == 'create':
            return LeadCreateSerializer
        return LeadSerializer

    # ── Follow-Up Actions ──────────────────────────────────────────────────────

    @action(detail=True, methods=['post'], url_path='add_reminder')
    def add_reminder(self, request, pk=None):
        """
        POST /api/leads/{id}/add_reminder/
        Body: { title, due_date, reminder_type, notes }
        Creates a follow-up reminder linked to the lead.
        """
        lead = self.get_object()
        data = request.data.copy()
        data['lead'] = lead.id

        serializer = ReminderSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        reminder = serializer.save()

        return Response(
            {'detail': 'Reminder added successfully.', 'reminder': ReminderSerializer(reminder).data},
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], url_path='notify_team')
    def notify_team(self, request, pk=None):
        """
        POST /api/leads/{id}/notify_team/
        Body: { recipient_ids: [1,2,3], message: "..." }
        Sends notification to selected team members.
        """
        lead = self.get_object()
        serializer = NotifyTeamSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        recipients = User.objects.filter(id__in=serializer.validated_data['recipient_ids'])

        notification = Notification.objects.create(
            lead=lead,
            sent_by=request.user,
            message=serializer.validated_data['message']
        )
        notification.recipients.set(recipients)

        return Response(
            {
                'detail': f'Notification sent to {recipients.count()} team member(s).',
                'notification_id': notification.id,
                'recipients': [u.get_full_name() or u.username for u in recipients]
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'], url_path='view_report')
    def view_report(self, request, pk=None):
        """
        GET /api/leads/{id}/view_report/
        Returns a detailed report for the specific lead.
        """
        lead = self.get_object()
        reminders = lead.reminders.all()
        notifications = lead.notifications.all()

        data = {
            'lead': LeadSerializer(lead, context={'request': request}).data,
            'reminders_count': reminders.count(),
            'pending_reminders': ReminderSerializer(
                reminders.filter(is_completed=False), many=True
            ).data,
            'completed_reminders': ReminderSerializer(
                reminders.filter(is_completed=True), many=True
            ).data,
            'notifications_count': notifications.count(),
            'recent_notifications': NotificationSerializer(
                notifications[:5], many=True
            ).data,
            'time_in_stage': self._time_in_current_stage(lead),
        }
        return Response(data)

    @action(detail=True, methods=['post'], url_path='mark_applied')
    def mark_applied(self, request, pk=None):
        """
        POST /api/leads/{id}/mark_applied/
        Moves lead to Application stage and records applied_at timestamp.
        """
        lead = self.get_object()
        if lead.stage in [LeadStage.DISBURSED, LeadStage.REJECTED]:
            return Response(
                {'detail': 'Cannot update a closed lead.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        lead.stage = LeadStage.APPLICATION
        lead.applied_at = timezone.now()
        lead.save(update_fields=['stage', 'applied_at', 'updated_at'])
        return Response({'detail': 'Lead marked as Applied.', 'applied_at': lead.applied_at})

    def _time_in_current_stage(self, lead):
        delta = timezone.now() - lead.updated_at
        hours = round(delta.total_seconds() / 3600, 1)
        return {'hours': hours, 'stage': lead.get_stage_display()}


# ── Reminder ViewSet ───────────────────────────────────────────────────────────

class ReminderViewSet(viewsets.ModelViewSet):
    """
    CRUD for Reminders.
    POST /api/reminders/{id}/complete/ — mark reminder done
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ReminderSerializer

    def get_queryset(self):
        qs = Reminder.objects.select_related('lead', 'created_by')
        
        # If not superuser, only see your own (optional, common in CRM)
        if not self.request.user.is_superuser:
            qs = qs.filter(Q(created_by=self.request.user) | Q(lead__assigned_to=self.request.user))

        is_completed = self.request.query_params.get('is_completed')
        if is_completed is not None:
            qs = qs.filter(is_completed=is_completed.lower() == 'true')

        lead_id = self.request.query_params.get('lead_id')
        if lead_id:
            qs = qs.filter(lead_id=lead_id)

        overdue = self.request.query_params.get('overdue')
        if overdue == 'true':
            qs = qs.filter(is_completed=False, due_date__lt=timezone.now())

        upcoming = self.request.query_params.get('upcoming')
        if upcoming == 'true':
            qs = qs.filter(is_completed=False, due_date__gte=timezone.now())

        return qs.order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        """POST /api/reminders/{id}/complete/ — mark a reminder as done."""
        reminder = self.get_object()
        if reminder.is_completed:
            return Response({'detail': 'Reminder already completed.'}, status=400)
        reminder.is_completed = True
        reminder.completed_at = timezone.now()
        reminder.save(update_fields=['is_completed', 'completed_at'])
        return Response({'detail': 'Reminder marked as complete.', 'completed_at': reminder.completed_at})


# ── Notification ViewSet ───────────────────────────────────────────────────────

class NotificationViewSet(viewsets.ModelViewSet):
    """
    CRUD for notifications.
    POST /api/notifications/{id}/mark_read/
    POST /api/notifications/mark_all_read/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(
            recipients=self.request.user
        ).select_related('sent_by', 'lead').order_by('-created_at')

    @action(detail=True, methods=['post', 'patch'], url_path='read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'detail': 'Notification marked as read.'})

    @action(detail=False, methods=['post', 'patch'], url_path='read-all')
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'detail': f'{updated} notification(s) marked as read.'})


# ── Team Member ViewSet ────────────────────────────────────────────────────────

class TeamMemberViewSet(viewsets.ModelViewSet):
    """
    CRUD for Team Members.
    GET /api/team/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TeamMemberSerializer

    def get_queryset(self):
        return TeamMember.objects.select_related('user').order_by('user__first_name')




from resources.models import Resource as AppResource

class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer

    def get_queryset(self):
        queryset = AppResource.objects.all().select_related('category')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset



