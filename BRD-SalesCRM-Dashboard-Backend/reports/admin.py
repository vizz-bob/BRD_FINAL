# Register your models here.
from django.contrib import admin
from .models import WeeklySnapshot, Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'metric_name', 'value', 'category', 'updated_at']
    list_filter = ['category', 'metric_name']


@admin.register(WeeklySnapshot)
class WeeklySnapshotAdmin(admin.ModelAdmin):

    list_display = (
        "week_number",
        "year",
        "total_leads",
        "applications",
        "disbursed_amount",
        "created_at",
    )

    list_filter = (
        "year",
        "week_number",
    )

    ordering = ("-year", "-week_number")

    readonly_fields = ("created_at",)

    fieldsets = (
        ("Week Info", {
            "fields": ("week_number", "year")
        }),
        ("Performance Metrics", {
            "fields": ("total_leads", "applications", "disbursed_amount")
        }),
        ("System", {
            "fields": ("created_at",)
        }),
    )