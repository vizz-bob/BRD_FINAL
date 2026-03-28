from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Lead, Reminder, Notification, TeamMember, Resource



@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'city', 'monthly_target', 'created_at']
    list_filter = ['role', 'city']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = [
        'borrower_name', 'contact_number', 'city_region',
        'loan_product', 'ticket_size', 'stage', 'assigned_to', 'created_at'
    ]
    list_filter = ['stage', 'loan_product', 'is_active', 'created_at']
    search_fields = ['borrower_name', 'contact_number', 'city_region']
    raw_id_fields = ['assigned_to', 'created_by']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Info', {
            'fields': ('borrower_name', 'contact_number', 'city_region')
        }),
        ('Loan Details', {
            'fields': ('loan_product', 'ticket_size', 'stage', 'internal_remarks')
        }),
        ('KYC Documents', {
            'fields': ('pan_document', 'aadhaar_document', 'gst_document'),
            'classes': ('collapse',)
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'created_by', 'is_active', 'applied_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['title', 'lead', 'reminder_type', 'due_date', 'is_completed', 'created_by']
    list_filter = ['reminder_type', 'is_completed', 'due_date']
    search_fields = ['title', 'lead__borrower_name']
    raw_id_fields = ['lead', 'created_by']
    readonly_fields = ['created_at', 'completed_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['sent_by', 'lead', 'message_preview', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['message', 'sent_by__username']
    filter_horizontal = ['recipients']
    readonly_fields = ['created_at']

    def message_preview(self, obj):
        return obj.message[:60] + '...' if len(obj.message) > 60 else obj.message
    message_preview.short_description = 'Message'

