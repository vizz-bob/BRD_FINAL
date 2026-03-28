from django.contrib import admin
from .models import EscalationRule


@admin.register(EscalationRule)
class EscalationRuleAdmin(admin.ModelAdmin):

    list_display = (
        'process_stage',
        'trigger_delay_hours',
        'action',
        'is_active',
        'created_at',
    )

    list_filter = (
        'process_stage',
        'action',
        'is_active',
    )

    search_fields = (
        'process_stage',
        'action',
    )

    ordering = ('-created_at',)
