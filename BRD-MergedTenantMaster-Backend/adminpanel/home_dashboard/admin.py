from django.contrib import admin
from .models import DashboardActivity, DashboardAlert


@admin.register(DashboardActivity)
class DashboardActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")
    search_fields = ("title",)


@admin.register(DashboardAlert)
class DashboardAlertAdmin(admin.ModelAdmin):
    list_display = ("alert_type", "message", "is_resolved", "created_at")
    list_filter = ("alert_type", "is_resolved")
