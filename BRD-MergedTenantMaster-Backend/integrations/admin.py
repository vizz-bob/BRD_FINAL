from django.contrib import admin
from .models import APIIntegration, WebhookLog


@admin.register(APIIntegration)
class APIIntegrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'provider', 'is_active', 'created_at')
    list_filter = ('tenant', 'provider', 'is_active')
    search_fields = ('name', 'provider')
    readonly_fields = ('created_at',)


@admin.register(WebhookLog)
class WebhookLogAdmin(admin.ModelAdmin):
    list_display = ('tenant', 'event', 'received_at')
    list_filter = ('tenant', 'event', 'received_at')
    search_fields = ('event',)
    readonly_fields = ('received_at',)
