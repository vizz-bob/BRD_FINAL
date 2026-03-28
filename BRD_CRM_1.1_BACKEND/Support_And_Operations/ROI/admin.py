from django.contrib import admin
from .models import Channel, ChannelAnalytics, ChannelAPILog

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('channel_name', 'channel_type', 'is_active', 'integration_required','Origin_type', 'Operational_valve','cost_per_lead')
    list_filter = ('channel_type', 'is_active')
    search_fields = ('channel_name', 'source_code')


@admin.register(ChannelAnalytics)
class ChannelAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('channel', 'total_leads', 'conversion_rate', 'roi')  # use real fields/properties
    list_filter = ('channel',)
    search_fields = ('channel__channel_name',)


@admin.register(ChannelAPILog)
class ChannelAPILogAdmin(admin.ModelAdmin):
    list_display = ('channel', 'status', 'created_at', 'message')  # match model fields
    list_filter = ('status',)
    search_fields = ('channel__channel_name',)
