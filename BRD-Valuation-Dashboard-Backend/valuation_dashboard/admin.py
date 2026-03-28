from django.contrib import admin
from .models import (
    NewValuationRequest,
    GenerateNewReport,
    ValuationDashboard,
    LocationDistribution,
    Valuation,
)


# ---------------------------------
# New Valuation Request Admin
# ---------------------------------
@admin.register(NewValuationRequest)
class NewValuationRequestAdmin(admin.ModelAdmin):
    list_display = (
        "property_type",
        "location",
        "request_date",
        "status",
        "created_at",
    )
    search_fields = ("property_type", "location")
    list_filter = ("status", "request_date")
    date_hierarchy = "request_date"
    ordering = ("-created_at",)


# ---------------------------------
# Generate New Report Admin
# ---------------------------------
@admin.register(GenerateNewReport)
class GenerateNewReportAdmin(admin.ModelAdmin):
    list_display = (
        "report_type",
        "from_date",
        "to_date",
        "status",
        "created_at",
    )
    list_filter = ("report_type", "status", "from_date")
    date_hierarchy = "from_date"
    ordering = ("-created_at",)


# ---------------------------------
# Valuation Dashboard Admin
# ---------------------------------
@admin.register(ValuationDashboard)
class ValuationDashboardAdmin(admin.ModelAdmin):
    list_display = (
        "pending_valuations",
        "completed_today",
        "average_value",
        "success_rate",
        "created_at",
    )
    ordering = ("-created_at",)


# ---------------------------------
# Location Distribution Admin
# ---------------------------------
@admin.register(LocationDistribution)
class LocationDistributionAdmin(admin.ModelAdmin):
    list_display = (
        "state",
        "month",
        "property_type",
        "valuations_count",
        "top_property_type",
        "avg_loan",
        "created_at",
    )
    search_fields = ("state", "property_type")
    list_filter = ("state", "month", "property_type")
    ordering = ("-created_at",)


# ---------------------------------
# Valuation Admin
# ---------------------------------
@admin.register(Valuation)
class ValuationAdmin(admin.ModelAdmin):
    list_display = (
        "valuation_id",
        "property_name",
        "location",
        "valuation_date",
        "estimated_value",
        "status",
        "created_at",
    )
    search_fields = ("valuation_id", "property_name", "location")
    list_filter = ("status", "valuation_date")
    date_hierarchy = "valuation_date"
    ordering = ("-created_at",)