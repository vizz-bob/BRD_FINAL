from django.contrib import admin
from .models import OperationsDashboard, PendingTask, SLABreachAlert


@admin.register(OperationsDashboard)
class OperationsDashboardAdmin(admin.ModelAdmin):
    list_display = (
        'pending_tasks',
        'completed_today',
        'sla_breaches',
        'ocr_failures',
        'created_at'
    )

@admin.register(SLABreachAlert)
class SLABreachAlertAdmin(admin.ModelAdmin):
    list_display = (
        "task_id",
        "title",
        "priority",
        "sla_hours",
        "elapsed_hours",
        "status",
        "is_escalated",
        "created_at",
    )
    list_filter = ("priority", "status", "is_escalated")
    search_fields = ("task_id", "title")
    readonly_fields = ("created_at",)

@admin.register(PendingTask)
class PendingTaskAdmin(admin.ModelAdmin):
    list_display = (
        'task_id',
        'type',
        'customer',
        'priority',
        'tat_remaining',
        'action',
        
    )


 