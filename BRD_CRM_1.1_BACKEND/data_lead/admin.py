from django.contrib import admin
from .models import Product,Lead,CampaignLead,InternalLead,LeadAssignmentHistory


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'email',
        'phone',
        'product',
        'created_at',
    )

    search_fields = (
        'name',
        'email',
        'phone',
    )

    list_filter = (
        'product',
        'created_at',
    )

    ordering = ('-created_at',)
from django.utils.html import format_html


@admin.register(CampaignLead)
class CampaignLeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'contact_name',
        'contact_phone',
        'lead_source',
        'lead_status',
        'conversion_status',
        'consent_obtained',
        'colored_status'
    
    )

    list_filter = (
        'lead_source',
        'lead_status',
        'conversion_status',
        'consent_obtained',
        'created_at'
    )

    search_fields = (
        'contact_name',
        'contact_phone',
        'contact_email',
    )
    readonly_fields = ( 'error_message', 'created_at')

    def colored_status(self, obj):
        color_map = {
            'PENDING': 'orange',
            'PROCESSING': 'blue',
            'UPLOADED': 'green',
            'FAILED': 'red',
        }
        return format_html(
            '<b style="color:{};">{}</b>',
            color_map.get(obj.status),
            obj.status
        )

    colored_status.short_description = "Status"

from .models import ThirdPartyLead
@admin.register(ThirdPartyLead)
class ThirdPartyLeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'contact_name',
        'contact_phone',
        'third_party_source',
        'lead_status',
        'lead_quality',
        'consent_obtained',
        'created_at',
    )

    list_filter = (
        'third_party_source',
        'lead_status',
        'lead_quality',
        'consent_obtained',
    )

    search_fields = (
        'contact_name',
        'contact_phone',
        'contact_email',
        'assigned_users'
        'third_party_lead_id',
    )

    def colored_status(self, obj):
        color_map = {
            'PENDING': 'orange',
            'PROCESSING': 'blue',
            'UPLOADED': 'green',
            'FAILED': 'red',
        }
        return format_html(
            '<b style="color:{};">{}</b>',
            color_map.get(obj.status),
            obj.status
        )

    colored_status.short_description = "Status"


@admin.register(InternalLead)
class InternalLeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'contact_name',
        'contact_phone',
        'Upload_Methods',
        'lead_status',
        'lead_quality',
        'consent_obtained',
        'created_at',
    )

    list_filter = (
        'internal_source',
        'lead_status',
        'lead_quality',
        'consent_obtained',
    )

    search_fields = (
        'contact_name',
        'contact_phone',
        'contact_email',
        'internal_lead_id',
    )

    ordering = ('-created_at',)

from .models import OnlineLead, OnlineLeadAssignmentHistory
@admin.register(OnlineLead)
class OnlineLeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'contact_name',
        'contact_phone',
        'online_source',
        'lead_status',
        'lead_quality',
        'consent_obtained',
        'created_at',
    )

    list_filter = (
        'online_source',
        'lead_status',
        'lead_quality',
        'consent_obtained',
    )

    search_fields = (
        'contact_name',
        'contact_phone',
        'contact_email',
        'online_lead_id',
    )

    ordering = ('-created_at',)

from .models import UsedLead, UsedLeadAssignmentHistory


@admin.register(UsedLead)
class UsedLeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'allocated_to',
        'status',
        'is_active',
        'last_contacted_at',
        'updated_at',
    )

    list_filter = (
        'status',
        'is_active',
    )

    search_fields = ('object_id',)

from .models import ArchivedLead, ArchivedLeadAssignmentHistory
@admin.register(ArchivedLead)
class ArchivedLeadAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'archived_reason',
        'archived_by',
        'allocated_to',
        'archived_at',
        'is_reactivated',
    )

    list_filter = (
        'archived_reason',
        'is_reactivated',
        'archived_at',
    )

    search_fields = (
        'object_id',
        'archived_notes',
    )

    readonly_fields = (
        'archived_by',
        'archived_at',
        'reactivated_by',
        'reactivated_at',
    )
from django.contrib import admin
from .models import UploadData, AllocateData


@admin.register(UploadData)
class UploadDataAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "configuration_name",
        "contact_name",
        "mobile_number",
        "email",
        "product",
        "lead_status",
        "lead_source",
        "assigned_user",
        "conversion_status",
        "consent_obtained",
        "created_at",
    )

    list_filter = (
        "product",
        "lead_status",
        "lead_source",
        "assigned_user",
        "conversion_status",
        "consent_obtained",
        "campaign_start_date",
        "campaign_end_date",
        "created_at",
    )

    search_fields = (
        "configuration_name",
        "contact_name",
        "mobile_number",
        "email",
        "tags",
    )

    readonly_fields = ("created_at", "updated_at")

    ordering = ("-created_at",)

    list_per_page = 25


@admin.register(AllocateData)
class AllocateDataAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "agent_to",
        "product",
        "created_at",
    )

    list_filter = (
        "agent_to",
        "product",
        "created_at",
    )

    search_fields = (
        "agent_to",
        "product",
    )

    ordering = ("-created_at",)

    list_per_page = 25
from django.contrib import admin
from .models import ReallocateAssignedLead


@admin.register(ReallocateAssignedLead)
class ReallocateAssignedLeadAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "current_assigned_user",
        "reassign_to",
    )

    list_filter = (
        "current_assigned_user",
        "reassign_to",
        
    )

    search_fields = (
        "current_assigned_user",
        "reassign_to",
    
    )

from django.contrib import admin
from .models import DataLeadDashboard


@admin.register(DataLeadDashboard)
class DataLeadDashboardAdmin(admin.ModelAdmin):

    list_display = (
        "Total_Campaign_Leads",
        "High_Quality_Leads",
        "Conversion_Rate",
        "Qualified_Leads",
        "created_at",
    )
