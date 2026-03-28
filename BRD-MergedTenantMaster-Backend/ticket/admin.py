from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'subject',
        'category',
        'priority',
        'tenant',
        'status',
        'created_at',
    )

    list_filter = (
        'tenant',
        'category',
        'priority',
        'status',
    )

    search_fields = ('subject',)
