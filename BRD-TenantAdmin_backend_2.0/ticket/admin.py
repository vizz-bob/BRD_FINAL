from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'subject',
        'category',
        'priority',
        'created_at',
    )

    list_filter = (
        'category',
        'priority',
    )

    search_fields = ('subject',)
