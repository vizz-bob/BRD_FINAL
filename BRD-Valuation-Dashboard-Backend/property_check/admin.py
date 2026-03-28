from django.contrib import admin
from .models import PropertyCheck, PropertyDashboard


# ----------------------------------
# Property Check Admin
# ----------------------------------
@admin.register(PropertyCheck)
class PropertyCheckAdmin(admin.ModelAdmin):
    list_display = (
        "property_name",
        "property_type",
        "location",
        "assigned_to",
        "created_at",
    )

    search_fields = (
        "property_name",
        "property_type",
        "location",
        "assigned_to",
    )

    list_filter = (
        "property_type",
        "assigned_to",
        "created_at",
    )

    ordering = ("-created_at",)
    readonly_fields = ("created_at",)


# ----------------------------------
# Property Dashboard Admin
# ----------------------------------
@admin.register(PropertyDashboard)
class PropertyDashboardAdmin(admin.ModelAdmin):
    list_display = (
        "total_properties",
        "pending_checks",
        "in_progress",
        "completed",
        "updated_at",
    )

    readonly_fields = ("updated_at",)

    ordering = ("-updated_at",)