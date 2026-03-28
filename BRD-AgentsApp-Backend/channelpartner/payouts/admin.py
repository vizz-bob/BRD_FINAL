from django.contrib import admin
from .models import Payout
from django.db.models import Sum
from decimal import Decimal

@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = [
        'payout_id',
        'lead_link',
        'partner_link',
        'commission_amount_display',
        'status',
        'transaction_id',
        'paid_at',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'created_at',
        'partner',
        'commission_percentage'
    ]
    
    search_fields = [
        'payout_id',
        'lead__lead_id',
        'lead__name',
        'partner__username',
        'partner__email',
        'transaction_id'
    ]
    
    ordering = ['-created_at']
    
    readonly_fields = ['payout_id', 'commission_amount', 'created_at', 'paid_at']
    
    fieldsets = (
        ('Payout Information', {
            'fields': ('payout_id', 'lead', 'partner', 'status', 'transaction_id')
        }),
        ('Financial Details', {
            'fields': (
                'disbursed_amount',
                'commission_percentage',
                'commission_amount'
            )
        }),
        ('Documentation', {
            'fields': ('invoice',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('paid_at', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def lead_link(self, obj):
        if obj.lead:
            return f"{obj.lead.lead_id} - {obj.lead.name}"
        return "-"
    lead_link.short_description = 'Lead'
    
    def partner_link(self, obj):
        if obj.partner:
            return getattr(obj.partner, 'username', None) or getattr(obj.partner, 'email', '-')
        return "-"
    partner_link.short_description = 'Partner'
    
    def commission_amount_display(self, obj):
        return f"₹{obj.commission_amount:,.2f}"
    commission_amount_display.short_description = 'Commission'
    
    actions = ['mark_as_paid']
    
    def mark_as_paid(self, request, queryset):
        from django.utils import timezone
        updated = queryset.filter(status='PENDING').update(status='PAID', paid_at=timezone.now())
        self.message_user(request, f'{updated} payout(s) marked as paid.')
    mark_as_paid.short_description = "Mark selected as PAID"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('lead', 'partner')
