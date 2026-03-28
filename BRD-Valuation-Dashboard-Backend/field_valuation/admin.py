from django.contrib import admin
from .models import (
    ScheduleVerification,
    AssignAgent,
    FieldVerification,
    FieldDashboard,
)


# -----------------------------
# Schedule Verification Admin
# -----------------------------
@admin.register(ScheduleVerification)
class ScheduleVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "property_id",
        "verification_date",
        "assign_agent",
        "created_at",
    )
    search_fields = ("property_id", "assign_agent")
    list_filter = ("assign_agent", "verification_date")
    date_hierarchy = "verification_date"
    ordering = ("-created_at",)


# -----------------------------
# Assign Agent Admin
# -----------------------------
@admin.register(AssignAgent)
class AssignAgentAdmin(admin.ModelAdmin):
    list_display = (
        "verification_id",
        "select_agent",
        "created_at",
    )
    search_fields = ("verification_id", "select_agent")
    list_filter = ("select_agent",)
    ordering = ("-created_at",)


# -----------------------------
# Field Verification Admin
# -----------------------------
@admin.register(FieldVerification)
class FieldVerificationAdmin(admin.ModelAdmin):
    list_display = (
        "field_id",
        "property_name",
        "owner",
        "date",
        "status",
        "agent",
        "priority",
        "action",
        "created_at",
    )
    search_fields = (
        "field_id",
        "property_name",
        "owner",
        "address",
    )
    list_filter = (
        "status",
        "agent",
        "priority",
        "date",
    )
    date_hierarchy = "date"
    ordering = ("-created_at",)


# -----------------------------
# Field Dashboard Admin
# -----------------------------
@admin.register(FieldDashboard)
class FieldDashboardAdmin(admin.ModelAdmin):
    list_display = (
        "today_visit",
        "pending_verification",
        "active_agents",
        "success_rate",
        "created_at",
    )
    ordering = ("-created_at",)