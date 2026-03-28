from django.contrib import admin
from .models import Communication


@admin.register(Communication)
class CommunicationAdmin(admin.ModelAdmin):
    list_display = ('channel', 'to', 'tenant', 'customer', 'status', 'created_at')
    search_fields = ('to', 'customer__first_name', 'customer__phone')
    list_filter = ('channel', 'status', 'tenant', 'created_at')
    readonly_fields = ('created_at',)
