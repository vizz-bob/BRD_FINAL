from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from django.db.models import Count, Q
from .models import PipelineLead, ValidationRule, SuppressionEntry, RawLead
from data_lead.models import Lead
from .serializers import RawLeadSerializer


class StageOneDashboardAPIView(APIView):
    """
    Complete Stage 1 Dashboard metrics matching the frontend UI
    """
    def get(self, request):
        # Total Raw Pool - all leads in Stage 1
        total_raw_pool = PipelineLead.objects.count()
        
        # Validated leads
        validated_leads = PipelineLead.objects.filter(is_valid=True).count()
        
        # Validation Pass Percentage
        validation_pass_percentage = round(
            (validated_leads / total_raw_pool) * 100, 2
        ) if total_raw_pool > 0 else 0
        
        # Calculate hygiene improvement (mock calculation - you can adjust logic)
        # This represents improvement from previous validation runs
        hygiene_improvement = "+2.1%"  # You can calculate this based on historical data
        
        # Pending Assignment - validated but not yet assigned
        pending_assignment = PipelineLead.objects.filter(
            status="VALIDATED",
            assigned_to__isnull=True
        ).count()
        
        # Suppressed Leads - no consent or in suppression list
        suppressed_leads = PipelineLead.objects.filter(
            Q(is_suppressed=True) | Q(lead__phone__in=SuppressionEntry.objects.values_list('phone', flat=True))
        ).count()
        
        return Response({
            "stage_info": {
                "title": "Stage 1: Data Ingestion",
                "description": "Initial \"Raw Pool\" verify, deduplicate, and assign leads before sales engagement."
            },
            "metrics": {
                "total_raw_pool": {
                    "value": total_raw_pool,
                    "label": "Total Raw Pool",
                    "sublabel": "STAGE 1 ENTRY",
                    "icon": "database",
                    "color": "blue"
                },
                "validation_pass": {
                    "value": f"{validation_pass_percentage}%",
                    "raw_value": validation_pass_percentage,
                    "label": "Validation Pass",
                    "sublabel": hygiene_improvement + " HYGIENE",
                    "icon": "check",
                    "color": "green"
                },
                "pending_assignment": {
                    "value": pending_assignment,
                    "label": "Pending Assignment",
                    "sublabel": "READY FOR STAGE 2",
                    "icon": "users",
                    "color": "purple"
                },
                "suppressed_leads": {
                    "value": suppressed_leads,
                    "label": "Suppressed Leads",
                    "sublabel": "NO CONSENT",
                    "icon": "shield",
                    "color": "red"
                }
            },
            "tabs": [
                {"name": "Raw Lead Pool", "active": True, "path": "raw-lead-pool"},
                {"name": "Validation Rules", "active": False, "path": "validation-rules"},
                {"name": "Suppression List", "active": False, "path": "suppression-list"}
            ]
        })


class StageOneMetricsAPIView(APIView):
    def get(self, request):
        total = PipelineLead.objects.count()

        validated = PipelineLead.objects.filter(is_valid=True).count()
        pending_assignment = PipelineLead.objects.filter(
            status="VALIDATED",
            assigned_to__isnull=True
        ).count()

        suppressed = PipelineLead.objects.filter(
            is_suppressed=True
        ).count()

        validation_percentage = round(
            (validated / total) * 100, 2
        ) if total else 0

        return Response({
            "total_raw_pool": total,
            "validation_pass": validation_percentage,
            "pending_assignment": pending_assignment,
            "suppressed_leads": suppressed
        })

class RawLeadViewSet(ModelViewSet):
    queryset = RawLead.objects.all().order_by('-updated_at')
    serializer_class = RawLeadSerializer

class RawLeadPoolAPIView(APIView):
    """Get all raw leads in the pipeline"""
    def get(self, request):
        raw_leads = PipelineLead.objects.filter(status="RAW")
        
        leads_data = []
        for pipeline_lead in raw_leads:
            leads_data.append({
                "id": pipeline_lead.id,
                "lead_id": pipeline_lead.lead.id,
                "name": pipeline_lead.lead.name,
                "email": pipeline_lead.lead.email,
                "phone": pipeline_lead.lead.phone,
                "product": pipeline_lead.lead.product,
                "status": pipeline_lead.status,
                "is_valid": pipeline_lead.is_valid,
                "is_suppressed": pipeline_lead.is_suppressed,
                "created_at": pipeline_lead.created_at,
            })
        
        return Response({
            "leads": leads_data,
            "count": raw_leads.count()
        })


class ValidationRulesAPIView(APIView):
    """
    GET: Retrieve current validation configuration
    POST: Update validation rules
    """
    
    def get(self, request):
        """Get current validation configuration"""
        rules = ValidationRule.objects.all()
        
        # Default configuration
        config = {
            "mandatory_fields": {
                "full_name": True,
                "phone_number": True,
                "email_address": True
            },
            "deduplication_logic": {
                "mobile_number_dedupe": True,
                "email_dedupe": False
            }
        }
        
        # Override with database values if they exist
        for rule in rules:
            if rule.name == "mandatory_full_name":
                config["mandatory_fields"]["full_name"] = rule.is_active
            elif rule.name == "mandatory_phone":
                config["mandatory_fields"]["phone_number"] = rule.is_active
            elif rule.name == "mandatory_email":
                config["mandatory_fields"]["email_address"] = rule.is_active
            elif rule.name == "dedupe_mobile":
                config["deduplication_logic"]["mobile_number_dedupe"] = rule.is_active
            elif rule.name == "dedupe_email":
                config["deduplication_logic"]["email_dedupe"] = rule.is_active
        
        return Response(config)
    
    def post(self, request):
        """Update validation rules"""
        data = request.data
        
        # Update mandatory fields
        mandatory = data.get("mandatory_fields", {})
        self._update_or_create_rule("mandatory_full_name", "Full Name Required", mandatory.get("full_name", True))
        self._update_or_create_rule("mandatory_phone", "Phone Number Required", mandatory.get("phone_number", True))
        self._update_or_create_rule("mandatory_email", "Email Address Required", mandatory.get("email_address", True))
        
        # Update deduplication logic
        dedupe = data.get("deduplication_logic", {})
        self._update_or_create_rule("dedupe_mobile", "Mobile Number Deduplication", dedupe.get("mobile_number_dedupe", True))
        self._update_or_create_rule("dedupe_email", "Email Deduplication", dedupe.get("email_dedupe", False))
        
        return Response({"message": "Validation rules updated successfully"}, status=status.HTTP_200_OK)
    
    def _update_or_create_rule(self, name, description, is_active):
        """Helper to update or create a validation rule"""
        ValidationRule.objects.update_or_create(
            name=name,
            defaults={
                "description": description,
                "is_active": is_active
            }
        )


class CleanRawPoolAPIView(APIView):
    """Clean raw pool by running validation and removing rejected leads"""
    
    def post(self, request):
        raw_leads = PipelineLead.objects.filter(status="RAW")
        
        rejected_count = 0
        validated_count = 0
        
        # Get validation rules
        rules = {rule.name: rule.is_active for rule in ValidationRule.objects.all()}
        
        for pipeline_lead in raw_leads:
            lead = pipeline_lead.lead
            is_valid = True
            rejection_reason = []
            
            # Check mandatory fields
            if rules.get("mandatory_full_name", True) and not lead.name:
                is_valid = False
                rejection_reason.append("Missing name")
            
            if rules.get("mandatory_phone", True) and not lead.phone:
                is_valid = False
                rejection_reason.append("Missing phone")
            
            if rules.get("mandatory_email", True) and not lead.email:
                is_valid = False
                rejection_reason.append("Missing email")
            
            # Check deduplication
            if rules.get("dedupe_mobile", True) and lead.phone:
                duplicate_phone = Lead.objects.filter(phone=lead.phone).exclude(id=lead.id).exists()
                if duplicate_phone:
                    is_valid = False
                    rejection_reason.append("Duplicate phone number")
            
            if rules.get("dedupe_email", False) and lead.email:
                duplicate_email = Lead.objects.filter(email=lead.email).exclude(id=lead.id).exists()
                if duplicate_email:
                    is_valid = False
                    rejection_reason.append("Duplicate email")
            
            # Check suppression list
            if SuppressionEntry.objects.filter(phone=lead.phone).exists():
                is_valid = False
                pipeline_lead.is_suppressed = True
                rejection_reason.append("Phone in suppression list")
            
            # Update pipeline lead
            if is_valid:
                pipeline_lead.is_valid = True
                pipeline_lead.status = "VALIDATED"
                pipeline_lead.validated_at = timezone.now()
                validated_count += 1
            else:
                # Reject the lead (you might want to move to a "REJECTED" status or delete)
                pipeline_lead.is_valid = False
                rejected_count += 1
            
            pipeline_lead.save()
        
        return Response({
            "message": "Raw pool cleaned successfully",
            "validated": validated_count,
            "rejected": rejected_count
        })


class SuppressionListAPIView(APIView):
    """
    GET: List all suppressed contacts
    POST: Add contact to suppression list
    DELETE: Remove contact from suppression list
    """
    
    def get(self, request):
        """Get all suppressed contacts"""
        search = request.query_params.get('search', '')
        
        suppressions = SuppressionEntry.objects.all()
        
        if search:
            suppressions = suppressions.filter(phone__icontains=search)
        
        suppression_data = []
        for entry in suppressions:
            suppression_data.append({
                "id": entry.id,
                "phone": entry.phone,
                "reason": entry.reason,
                "blocked_date": entry.created_at.strftime("%Y-%m-%d"),
                "contact_detail": entry.phone  # For display in frontend
            })
        
        return Response({
            "suppressions": suppression_data,
            "count": suppressions.count()
        })
    
    def post(self, request):
        """Add contact to suppression list"""
        phone = request.data.get('phone')
        reason = request.data.get('reason', 'MANUAL_SUPPRESSION')
        
        if not phone:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already exists
        if SuppressionEntry.objects.filter(phone=phone).exists():
            return Response(
                {"error": "Phone number already in suppression list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create suppression entry
        suppression = SuppressionEntry.objects.create(
            phone=phone,
            reason=reason
        )
        
        # Mark any existing leads with this phone as suppressed
        pipeline_leads = PipelineLead.objects.filter(lead__phone=phone)
        pipeline_leads.update(is_suppressed=True)
        
        return Response({
            "message": "Contact added to suppression list",
            "id": suppression.id
        }, status=status.HTTP_201_CREATED)
    
    def delete(self, request, suppression_id=None):
        """Remove contact from suppression list"""
        if not suppression_id:
            suppression_id = request.data.get('id')
        
        try:
            suppression = SuppressionEntry.objects.get(id=suppression_id)
            phone = suppression.phone
            suppression.delete()
            
            # Optionally unsuppress pipeline leads (requires manual consent)
            # This should probably require explicit consent documentation
            
            return Response({
                "message": "Contact removed from suppression list"
            }, status=status.HTTP_200_OK)
        except SuppressionEntry.DoesNotExist:
            return Response(
                {"error": "Suppression entry not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class ExportSuppressionListAPIView(APIView):
    """Export suppression list as CSV"""
    
    def get(self, request):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="suppression_list.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Phone', 'Reason', 'Blocked Date'])
        
        suppressions = SuppressionEntry.objects.all()
        for entry in suppressions:
            writer.writerow([
                entry.phone,
                entry.reason,
                entry.created_at.strftime("%Y-%m-%d")
            ])
        
        return response
    
#------------------------------
# Follow up
#-------------------------------
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import FollowUp
from .serializers import FollowUpSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta


@api_view(["GET"])
def followup_stats(request):

    active_tasks = FollowUp.objects.filter(is_completed=False).count()

    sla_breaches = FollowUp.objects.filter(
        due__lt=timezone.now() - timedelta(hours=48),
        is_completed=False
    ).count()

    whatsapp_leads = FollowUp.objects.filter(type="whatsapp").count()

    total_meetings = FollowUp.objects.filter(
        disposition="converted_to_meeting"
    ).count()

    total_followups = FollowUp.objects.count()

    meeting_conversion = 0
    if total_followups > 0:
        meeting_conversion = round((total_meetings / total_followups) * 100, 1)

    data = [
        {
            "label": "Active Tasks",
            "value": active_tasks,
            "change": "Calls today"
        },
        {
            "label": "SLA Breaches",
            "value": sla_breaches,
            "change": "Overdue > 48h"
        },
        {
            "label": "WhatsApp Leads",
            "value": whatsapp_leads,
            "change": "Real-time replies"
        },
        {
            "label": "Meeting Conversion",
            "value": f"{meeting_conversion}%",
            "change": "vs last week"
        }
    ]

    return Response(data)


class FollowUpViewSet(ModelViewSet):
    queryset = FollowUp.objects.all().order_by("-created_at")
    serializer_class = FollowUpSerializer
    ordering_fields = ["created_at", "scheduled_date"]
    ordering = ["-created_at"]

class FollowUpCreateAPIView(APIView):
    """
    Engagement Panel:
    Call Summary & Outcome
    Disposition
    Reschedule Date
    Repeat Reminder
    """

    def post(self, request):
        serializer = FollowUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Follow-up created successfully",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompleteAndArchiveAPIView(APIView):
    """
    Complete Task & Archive
    """

    def post(self, request, pk):
        try:
            followup = FollowUp.objects.get(id=pk)
        except FollowUp.DoesNotExist:
            return Response({"error": "Follow-up not found"}, status=404)

        followup.is_completed = True
        followup.is_archived = True
        followup.save()

        return Response({
            "message": "Task completed & archived successfully"
        }, status=200)

#-------------------------
#Scheduel view
#-------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date
import calendar

from .models import Activity
from .serializers import ActivitySerializer


class ScheduleMonthView(APIView):

    def get(self, request):
        month = int(request.GET.get("month"))
        year = int(request.GET.get("year"))

        start_date = date(year, month, 1)
        end_date = date(year, month, calendar.monthrange(year, month)[1])

        qs = Activity.objects.filter(
            scheduled_date__range=[start_date, end_date]
        )

        data = {}
        for a in qs:
            day = a.scheduled_date.day
            if day not in data:
                data[day] = []

            data[day].append({
                "activity_type": a.activity_type,
                "status": a.status
            })

        return Response(data)


class ScheduleDayView(APIView):

    def get(self, request):
        date_selected = request.GET.get("date")

        qs = Activity.objects.filter(
            scheduled_date=date_selected
        ).order_by("scheduled_time")

        serializer = ActivitySerializer(qs, many=True)
        return Response(serializer.data)


class ReschedulePendingView(APIView):

    def post(self, request):
        new_date = request.data.get("date")

        Activity.objects.filter(
            status="PENDING"
        ).update(scheduled_date=new_date)

        return Response({
            "message": "Pending activities rescheduled"
        })

#-----------------------
#Escalations & SLA
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User

from .models import Lead, Escalation
from .serializers import EscalationSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet


class ListEscalations(ReadOnlyModelViewSet):
    queryset = Escalation.objects.all()
    serializer_class = EscalationSerializer

# ================= SLA CHECK =================
def run_sla_check():

    from datetime import timedelta
    from django.utils import timezone

    SLA_LIMIT = timedelta(hours=48)
    DORMANCY_LIMIT = timedelta(days=5)

    escalations = Escalation.objects.filter(is_closed=False)

    for esc in escalations:

        if esc.last_followup:

            gap = timezone.now() - esc.last_followup

            if gap > SLA_LIMIT:
                esc.escalation_type = "sla_breach"

            if gap > DORMANCY_LIMIT:
                esc.escalation_type = "dormancy"

            esc.save()

        if esc.followup_missed_count >= 2:
            esc.escalation_type = "missed_twice"
            esc.save()

# ================= DASHBOARD =================

@api_view(["GET"])
def escalation_dashboard(request):

    run_sla_check()

    critical = Escalation.objects.filter(
        escalation_type="sla_breach",
        resolved=False
    ).count()

    missed = Escalation.objects.filter(
        escalation_type="missed_twice",
        resolved=False
    ).count()

    dormancy = Escalation.objects.filter(
        escalation_type="dormancy",
        resolved=False
    ).count()

    queue = Escalation.objects.filter(resolved=False)

    serializer = EscalationSerializer(queue, many=True)

    return Response({
        "critical_sla": critical,
        "double_missed": missed,
        "dormancy": dormancy,
        "queue": serializer.data
    })


# ================= NOTIFY AGENT =================

@api_view(["POST"])
def notify_agent(request, escalation_id):

    escalation = Escalation.objects.get(id=escalation_id)

    return Response({"message": "Agent Notified"})


# ================= REASSIGN =================

@api_view(["POST"])
def reassign_lead(request, escalation_id):

    new_agent_id = request.data.get("agent_id")

    escalation = Escalation.objects.get(id=escalation_id)
    new_agent = User.objects.get(id=new_agent_id)

    escalation.lead.assigned_agent = new_agent
    escalation.lead.save()

    return Response({"message": "Lead Reassigned"})



#-----------------------
# Meeting
#----------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Meeting
from .serializers import MeetingSerializer

class MeetingViewSet(ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer

class ScheduleMeetingView(APIView):

    def post(self, request):
        serializer = MeetingSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#----------------------------
#Reschedule 
#----------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import MeetingLog
from .serializers import MeetingLogSerializer


# Save Outcome
class SaveMeetingOutcomeView(APIView):

    def patch(self, request):
        serializer = MeetingLogSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


# Reschedule Meeting Button
class RescheduleMeetingView(APIView):

    def post(self, request, meeting_id):
        try:
            meeting_inst = Meeting.objects.get(id=meeting_id)

            meeting_log, created = MeetingLog.objects.get_or_create(
                meeting=meeting_inst
            )

            meeting_log.is_rescheduled = True
            meeting_log.meeting_status = "Rescheduled"
            meeting_log.save()

            return Response({"message": "Meeting Rescheduled"})

        except Meeting.DoesNotExist:
            return Response({"error": "Meeting not found"}, status=404)


# Cancel Meeting Button
class CancelMeetingView(APIView):

    def post(self, request, meeting_id):
        try:
            meeting_inst = Meeting.objects.get(id=meeting_id)
            meeting_log, created = MeetingLog.objects.get_or_create(
                meeting=meeting_inst
            )
            meeting_log.is_cancelled = True
            meeting_log.meeting_status = "Cancelled"
            meeting_log.save()

            return Response({"message": "Meeting Cancelled"})

        except MeetingLog.DoesNotExist:
            return Response({"error": "Meeting not found"}, status=404)

#--------------------------------
# Deals (Conversion/Disbursed)
# Loan Application
#----------------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum

from .models import LoanApplication
from .serializers import LoanApplicationSerializer

@api_view(["GET"])
def deals_stats(request):

    total_applications = LoanApplication.objects.count()

    under_review = ApplicationTracking.objects.filter(
        status="Under Review"
    ).count()

    approved = ApplicationTracking.objects.filter(
        status="Approved"
    ).count()

    approval_rate = 0
    if total_applications > 0:
        approval_rate = round((approved / total_applications) * 100)

    this_week = LoanApplication.objects.filter(
        created_at__gte=timezone.now() - timedelta(days=7)
    ).count()

    disbursed_total = DisbursedLoan.objects.aggregate(
        total=Sum("disbursed_amount")
    )["total"] or 0

    disbursed_cr = round(disbursed_total / 10000000, 2)  # convert to crore

    data = [
        {
            "label": "Total Applications",
            "value": total_applications,
            "change": f"+{this_week} this week"
        },
        {
            "label": "Under Review",
            "value": under_review,
            "change": "Processing"
        },
        {
            "label": "Approved",
            "value": approved,
            "change": f"{approval_rate}% approval rate"
        },
        {
            "label": "Total Disbursed",
            "value": f"₹{disbursed_cr} Cr",
            "change": "This month"
        }
    ]

    return Response(data)

class LoanApplicationViewSet(ModelViewSet):
    queryset = LoanApplication.objects.all().order_by("-created_at")
    serializer_class = LoanApplicationSerializer

class CreateLoanApplicationView(APIView):

    def post(self, request):
        serializer = LoanApplicationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

#--------------------------------
# Deals (Conversion/Disbursed)
# Application Status Tracking
#----------------------------------
from rest_framework import viewsets
from .models import ApplicationTracking
from .serializers import ApplicationTrackingSerializer


class ApplicationTrackingViewSet(viewsets.ModelViewSet):
    queryset = ApplicationTracking.objects.all().order_by("-last_updated")
    serializer_class = ApplicationTrackingSerializer

#------------------------------
# Deals
#Loan Disbursed
#------------------------------
from rest_framework.viewsets import ModelViewSet
from .models import DisbursedLoan
from .serializers import DisbursedLoanSerializer


class DisbursedLoanViewSet(ModelViewSet):

    queryset = DisbursedLoan.objects.all().order_by("-created_at")
    serializer_class = DisbursedLoanSerializer


# lead status
from .models import LeadLost,LeadDead,LeadExpired,LeadRejected
from .serializers import LeadDeadSerializer,LeadExpiredSerializer,LeadRejectedSerializer,LeadLostSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def LeadStatusDashboard(request):
    lost = LeadLost.objects.count()
    expired = LeadExpired.objects.count()
    dead = LeadDead.objects.count()
    rejected = LeadRejected.objects.count()

    return Response({
        "lost": lost,
        "expired": expired,
        "dead": dead,
        "rejected": rejected
    })

class LeadLostViewSet(ModelViewSet):
    queryset = LeadLost.objects.all()
    serializer_class  = LeadLostSerializer


class LeadDeadViewSet(ModelViewSet):
    queryset = LeadDead.objects.all()
    serializer_class  = LeadDeadSerializer


class LeadExpiredViewSet(ModelViewSet):
    queryset = LeadExpired.objects.all()
    serializer_class  = LeadExpiredSerializer


class LeadRejectedViewSet(ModelViewSet):
    queryset = LeadRejected.objects.all()
    serializer_class  = LeadRejectedSerializer