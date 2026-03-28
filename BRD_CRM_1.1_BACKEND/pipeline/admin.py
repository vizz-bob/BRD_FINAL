from django.contrib import admin
from .models import (
    PipelineLead,
    RawLead,
    ValidationRule,
    SuppressionEntry,
    RawLead
)

admin.site.register(RawLead)
@admin.register(PipelineLead)
class PipelineLeadAdmin(admin.ModelAdmin):
    list_display = (
        "lead_name",
        "lead_phone",
        "lead_product",  # Changed from lead_source
        "status",
        "is_valid",
        "is_suppressed",
        "assigned_to",
        "created_at",
     
    )

    list_filter = (
        "status",
        "is_valid",
        "is_suppressed",
  
    )
    search_fields = (
        "lead__name",  # Changed from lead__full_name
        "lead__phone",
        "lead__email",
    )

    readonly_fields = (
        "created_at",
        "validated_at",
        "assigned_at",
    )

    autocomplete_fields = ("assigned_to",)

    ordering = ("-created_at",)

    fieldsets = (
        ("Lead Information", {
            "fields": (
                "lead",
            )
        }),
        ("Pipeline Status", {
            "fields": (
                "status",
                "is_valid",
                "is_suppressed",
                "assigned_to",
            )
        }),
        ("Timestamps", {
            "fields": (
                "created_at",
                "validated_at",
                "assigned_at",
            )
        }),
    )

    def lead_name(self, obj):
        return obj.lead.name  # Changed from obj.lead.full_name
    lead_name.short_description = "Name"

    def lead_phone(self, obj):
        return obj.lead.phone
    lead_phone.short_description = "Phone"

    def lead_product(self, obj):  # Changed from lead_source
        return obj.lead.product
    lead_product.short_description = "Product"


@admin.register(ValidationRule)
class ValidationRuleAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(SuppressionEntry)
class SuppressionEntryAdmin(admin.ModelAdmin):
    list_display = ("phone", "reason", "created_at")
    search_fields = ("phone",)
    ordering = ("-created_at",)
#---------------------
# Follow up
#----------------------
from django.contrib import admin
from django.utils.timezone import now
from .models import FollowUp


admin.site.register(FollowUp)
#------------------------
# Schedule View
#-------------------------
from django.contrib import admin
from django.utils.timezone import now
from .models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'activity_type',
        'task_type',
        'scheduled_date',
        'scheduled_time',
        'status',
        'created_at',
    )

    list_filter = (
        'activity_type',
        'task_type',
        'status',
        'scheduled_date',
    )

    date_hierarchy = 'scheduled_date'   # ⭐ IMAGE JAISE DATE NAVIGATION

    ordering = ('scheduled_date', 'scheduled_time')

    search_fields = (
        'title',
    )

    # ⭐ DEFAULT: Aaj ke scheduled items
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(
            scheduled_date=now().date()
        )

#--------------------------
#Escalations & SLA
#--------------------------
from django.contrib import admin
from .models import Escalation



@admin.register(Escalation)
class EscalationAdmin(admin.ModelAdmin):
    list_display = (
        "lead_name",
        "assigned_agent",
        "escalation_type",
        "followup_missed_count",
        "is_closed",
        "created_at",
    )

#------------------------
# Meeting
#------------------------
from django.contrib import admin
from .models import Meeting


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = (
        "lead_name",
        "lead_id",
        "meeting_type",
        "meeting_mode",
        "date",
        "time",
    )

    search_fields = ("lead_name", "lead_id", "phone_number")

# #----------------------
# # Reschuedule 
# #------------------------
# from django.contrib import admin
# from .models import MeetingLog


# @admin.register(MeetingLog)
# class RescheduleAdmin(admin.ModelAdmin):
#     list_display = (
#         "meeting_id",
#         "meeting_status",
#         "meeting_outcome",
#         "next_action",
#         "is_rescheduled_meeting",
#         "is_cancelled",
#     )

#--------------------------------
# Deals (Conversion/Disbursed)
# Loan Application
#----------------------------------
from django.contrib import admin
from .models import LoanApplication


@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):

    list_display = (
        "lead_name",
        "product_type",
        "requested_amount",
        "tenure_months",
        "application_status",
        "created_at",
    )

    search_fields = ("lead_name",)

#--------------------------------
# Deals (Conversion/Disbursed)
# Application Status Tracking
#----------------------------------
from django.contrib import admin
from .models import ApplicationTracking


@admin.register(ApplicationTracking)
class ApplicationTrackingAdmin(admin.ModelAdmin):

    list_display = (
        "application_id",
        "applicant_name",
        "loan_type",
        "loan_amount",
        "status",
        "risk_category",
        "assigned_underwriter",
        "last_updated"
    )

    list_filter = ("status", "risk_category")
    search_fields = ("application_id", "applicant_name")

#------------------------------
# Deals
#Loan Disbursed
#------------------------------
from django.contrib import admin
from .models import DisbursedLoan


@admin.register(DisbursedLoan)
class DisbursedLoanAdmin(admin.ModelAdmin):
    list_display = (
        "loan_id",
        "customer_name",
        "product",
        "disbursed_amount",
        "emi_amount",
        "status",
    )

#-------------------------------
# Deal Status
# Lead Lost
#-------------------------------
from django.contrib import admin
from .models import LeadLost


@admin.register(LeadLost)
class LeadLostAdmin(admin.ModelAdmin):

    list_display = (
        "lead_id",
        "name",
        "product",
        "reason_for_loss",
        "agent_name",
        "date_marked_lost",
        "days_inactive",
        "lost_value_display",
    )

    list_filter = (
        "product",
        "reason_for_loss",
        "agent_name",
    )

    search_fields = (
        "lead_id",
        "name",
        "phone",
        "email",
    )

#-------------------------------
# Deal Status
# Lead Dead
#-------------------------------
from django.contrib import admin
from .models import LeadDead


@admin.register(LeadDead)
class LeadDeadAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "lead_id_display",
        "product_type",
        "reason_for_dead",
        "verified_by",
        "date_marked_dead",
        "mark_as_fraud",
    )

    list_filter = (
        "product_type",
        "reason_for_dead",
        "verified_by",
        "data_source",
        "mark_as_fraud",
    )

    search_fields = (
        "name",
        "lead_id",
        "phone",
        "email",
    )

    ordering = ("-date_marked_dead",)

#-------------------------------
# Lead Status
# Lead Expired
#-------------------------------
from django.contrib import admin
from .models import LeadExpired


@admin.register(LeadExpired)
class LeadExpiredAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "lead_id_display",
        "product_type",
        "validity_expiry_date",
        "expiry_reason",
        "assigned_agent",
        "days_expired",
        "system_auto_expired",
    )

    list_filter = (
        "product_type",
        "expiry_reason",
        "assigned_agent",
        "system_auto_expired",
    )

    search_fields = (
        "name",
        "lead_id",
        "phone",
        "email",
    )

    ordering = ("-validity_expiry_date",)

#-------------------------------
#Lead Status
# Lead Rejected
#-------------------------------
from django.contrib import admin
from .models import LeadRejected


@admin.register(LeadRejected)
class LeadRejectedAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "lead_id_display",
        "product_type",
        "reason_for_rejection",
        "rejection_stage",
        "rejected_by",
        "credit_score",
        "required_score",
        "rejection_date",
    )

    list_filter = (
        "product_type",
        "reason_for_rejection",
        "rejection_stage",
        "rejected_by",
    )

    search_fields = (
        "name",
        "lead_id",
        "phone",
        "email",
        "application_id",
    )

    ordering = ("-rejection_date",)


from .models import LeadStatusDashboard

@admin.register(LeadStatusDashboard)
class LeadStatusDashboardAdmin(admin.ModelAdmin):
    list_display = ('lead_lost', 'lead_dead', 'lead_expired', 'lead_rejected', 'created_at', 'updated_at')

from .models import DealsDashboard

@admin.register(DealsDashboard)
class DealsDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_applications',
        'under_review',
        'approved',
        'total_disbursed',
        'created_at'
    )

#lead list view
from .models import LeadListViews
@admin.register(LeadListViews)
class LeadListViewsAdmin(admin.ModelAdmin):
    list_display = (
        'mobile_number',
        'lead_source',
        'lifecycle_timeline',
        'created_at',
    )

    list_filter = ('lifecycle_timeline', 'lead_source')

    search_fields = ('mobile_number', 'lead_source')

# raw leads dashboard
from .models import RawLeadsDashboard
@admin.register(RawLeadsDashboard)
class RawLeadsDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_raw_leads',
        'new_today',
        'stagnant',
        'duplicate_flags',
        'created_at'
    )

# follow up dashboard
from .models import FollowUpDashboard
@admin.register(FollowUpDashboard)
class FollowUpDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'active_tasks',
        'sla_breaches',
        'whatsapp_leads',
        'meeting_conversion',
        'created_at'
    )
# escalation data

from django.contrib import admin
from .models import EscalationData

@admin.register(EscalationData)
class EscalationDataAdmin(admin.ModelAdmin):
    list_display = ('critical_sla_breaches', 'double_missed_leads', 'dormancy_risk')

from .models import MeetingsDashboard

@admin.register(MeetingsDashboard)
class MeetingsDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_meetings',
        'scheduled',
        'completed',
        'rescheduled',
    )

from .models import RescheduledDashboard
@admin.register(RescheduledDashboard)
class RescheduledDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_rescheduled',
        'multiple_reschedules',
        'avg_reschedules',
    )    