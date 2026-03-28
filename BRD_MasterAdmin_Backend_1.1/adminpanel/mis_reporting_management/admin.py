from django.contrib import admin
from .models import MISReport, NotificationMaster


# ================= MIS REPORT ADMIN =================
@admin.register(MISReport)
class MISReportAdmin(admin.ModelAdmin):
    list_display = (
        "report_name",
        "report_type",
        "is_active",
        "created_at",
    )
    search_fields = ("report_name",)
    list_filter = ("report_type", "is_active")
    readonly_fields = ("created_at",)


# ================= NOTIFICATION ADMIN =================
@admin.register(NotificationMaster)
class NotificationMasterAdmin(admin.ModelAdmin):
    list_display = (
        "notification_action",
        "notification_type",
        "importance_level",
        "is_active",
        "created_at",
    )
    search_fields = ("notification_action", "notification_subject")
    list_filter = ("notification_type", "is_active")
    readonly_fields = ("created_at",)
