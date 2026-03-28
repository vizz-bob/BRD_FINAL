from django.contrib import admin
from .models import ChannelPartner


@admin.register(ChannelPartner)
class ChannelPartnerAdmin(admin.ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'mobile_number',
        'partner_type',
        'status',
        'document_verification_completed',
        'created_at'
    )
    list_filter = ('partner_type', 'status')
    search_fields = ('first_name', 'last_name', 'mobile_number', 'email')
