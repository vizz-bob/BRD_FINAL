# checked_lead/admin.py
from django.contrib import admin
from .models import CheckedLead

@admin.register(CheckedLead)
class CheckedLeadAdmin(admin.ModelAdmin):
    list_display = ('lead_name', 'mobile_no', 'lead_source', 'agent', 'updated_at')
    search_fields = ('lead__name', 'mobile_no', 'agent__username', 'lead_source')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-updated_at',)

    actions = ['move_to_attempted', 'mark_not_interested']

    def lead_name(self, obj):
        return getattr(obj.lead, 'name', 'Unknown Lead')
    lead_name.admin_order_field = 'lead__name'
    lead_name.short_description = 'Lead'

    def move_to_attempted(self, request, queryset):
        for checked in queryset:
            checked.lead.status = 'attempted'
            checked.lead.save()
        self.message_user(request, f"{queryset.count()} lead(s) moved to Attempted")
    move_to_attempted.short_description = "Move selected leads to Attempted"

    def mark_not_interested(self, request, queryset):
        for checked in queryset:
            checked.lead.status = 'not_interested'
            checked.lead.save()
        self.message_user(request, f"{queryset.count()} lead(s) marked as Not Interested")
    mark_not_interested.short_description = "Mark selected leads as Not Interested"
