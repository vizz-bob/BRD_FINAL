from django.contrib import admin
from .models import LeadScan, LeadRequirement, LeadConsent, NewLeadRequest, ViewDetails

@admin.register(NewLeadRequest)
class NewLeadRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'mobile_number', 'product_type', 'loan_amount_required', 'status', 'created_at']
    list_filter = ['status', 'product_type', 'created_at']
    search_fields = ['full_name', 'mobile_number', 'email', 'pan_number', 'aadhar_number']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Personal Details', {
            'fields': ('full_name', 'mobile_number', 'email', 'pan_number', 'aadhar_number', 'address')
        }),
        ('Loan Details', {
            'fields': ('product_type', 'loan_amount_required')
        }),
        ('Status & Timestamps', {
            'fields': ('status', 'created_by', 'created_at', 'updated_at')
        }),
    )
@admin.register(LeadScan)
class LeadScanAdmin(admin.ModelAdmin):
    list_display = ['user', 'lead', 'scan_type', 'success', 'created_at']
    list_filter = ['scan_type', 'success', 'created_at']
    search_fields = ['user__username', 'lead__lead_id', 'raw_text']
    readonly_fields = ['created_at', 'raw_text', 'extracted_data', 'image', 'user', 'lead']
    
    def has_add_permission(self, request):
        return False

@admin.register(LeadRequirement)
class LeadRequirementAdmin(admin.ModelAdmin):
    list_display = ['product_type', 'minimum_amount']
    search_fields = ['product_type']

@admin.register(LeadConsent)
class LeadConsentAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'updated_at']
    list_filter = ['is_active']
