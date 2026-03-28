from django.contrib import admin
from .models import Lead, LeadQuery, LeadDocument, LeadActivity, LeadComment, LeadViewDetails
from .models import SanctionedLead, Customer, LeadStatusHistory
@admin.register(LeadViewDetails)
class ViewDetailsAdmin(admin.ModelAdmin):
    list_display = [
        'lead', 'lead_product', 'lead_amount',
        'user', 'username',
        'viewed_at', 'ip_address', 'user_agent'
    ]
    list_filter = ['viewed_at', 'user', 'lead__product_type']
    search_fields = [
        'lead__lead_id', 'lead__product_type',
        'user__username', 'ip_address', 'user_agent'
    ]
    readonly_fields = ['viewed_at']

    def username(self, obj):
        return obj.user.username if obj.user else 'Unknown'
    username.short_description = 'User'

    def lead_product(self, obj):
        return obj.lead.product_type
    lead_product.short_description = 'Product'

    def lead_amount(self, obj):
        amt = getattr(obj.lead, 'amount', None)
        if amt is not None:
            return f"₹{amt:,.2f}"
        return ''
    lead_amount.short_description = 'Loan Amount'

class LeadQueryInline(admin.TabularInline):
    model = LeadQuery
    extra = 0
    readonly_fields = ['created_at', 'updated_at']

class LeadDocumentInline(admin.TabularInline):
    model = LeadDocument
    extra = 0
    readonly_fields = ['uploaded_at']

class LeadCommentInline(admin.StackedInline):
    model = LeadComment
    extra = 0
    readonly_fields = ['created_at', 'updated_at']

class LeadActivityInline(admin.TabularInline):
    model = LeadActivity
    extra = 0
    readonly_fields = ['activity_type', 'description', 'user', 'created_at']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = [
        'lead_id', 'name', 'mobile', 'product_type', 
        'amount_display', 'status', 'partner', 'credit_ops', 'created_at'
    ]
    list_filter = ['status', 'product_type', 'created_at', 'partner', 'credit_ops']
    search_fields = ['lead_id', 'name', 'mobile', 'email', 'pan', 'aadhaar']
    ordering = ['-created_at']
    readonly_fields = ['lead_id', 'created_at', 'updated_at']
    
    inlines = [LeadQueryInline, LeadDocumentInline, LeadCommentInline, LeadActivityInline]
    
    fieldsets = (
        ('Lead Information', {'fields': ('lead_id', 'status')}),
        ('Personal Details', {'fields': ('name', 'mobile', 'email')}),
        ('Loan Details', {'fields': ('product_type', 'amount')}),
        ('Documents', {'fields': ('pan', 'aadhaar', 'pan_image', 'aadhaar_image'), 'classes': ('collapse',)}),
        ('Assignment', {'fields': ('partner', 'credit_ops')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    
    def amount_display(self, obj):
        return f"₹{obj.amount:,.2f}"
    amount_display.short_description = 'Amount'

@admin.register(LeadQuery)
class LeadQueryAdmin(admin.ModelAdmin):
    list_display = ['lead', 'title', 'raised_by', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['lead__lead_id', 'title', 'description']

@admin.register(LeadDocument)
class LeadDocumentAdmin(admin.ModelAdmin):
    list_display = ['lead', 'document_type', 'uploaded_by', 'verification_status', 'uploaded_at']
    list_filter = ['document_type', 'verification_status', 'uploaded_at']
    readonly_fields = ['uploaded_at', 'verified_at', 'verified_by']
    search_fields = ['lead__lead_id', 'description']

@admin.register(LeadActivity)
class LeadActivityAdmin(admin.ModelAdmin):
    list_display = ['lead', 'activity_type', 'user', 'created_at']
    list_filter = ['activity_type', 'created_at']
    readonly_fields = ['lead', 'user', 'activity_type', 'description', 'metadata', 'created_at']

@admin.register(LeadComment)
class LeadCommentAdmin(admin.ModelAdmin):
    list_display = ['lead', 'user', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at']

@admin.register(SanctionedLead)
class SanctionedLeadAdmin(admin.ModelAdmin):
    list_display = ['lead', 'sanctioned_amount', 'interest_rate', 'tenure_months', 'sanctioned_date']


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['lead', 'pan', 'aadhaar']
    search_fields = ['lead__lead_id', 'pan', 'aadhaar']


@admin.register(LeadStatusHistory)
class LeadStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['lead', 'stage', 'status', 'updated_at', 'updated_by']
    list_filter = ['stage', 'status', 'updated_at']
    readonly_fields = ['updated_at']

