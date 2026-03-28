from django.contrib import admin
from .models import (
    PropertyInformation,
    ValuationAssessment,
    ClientInformation,
    Details,
    Documents,
    RecentValuation
)

# ---------------------------------
# Property Information Admin
# ---------------------------------
@admin.register(PropertyInformation)
class PropertyInformationAdmin(admin.ModelAdmin):
    list_display = (
        "property_type",
        "address",
        "request_date",
        "completion_date",
        "created_at",
    )
    search_fields = ("property_type", "address")
    list_filter = ("request_date", "completion_date")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)


# ---------------------------------
# Valuation Assessment Admin
# ---------------------------------
@admin.register(ValuationAssessment)
class ValuationAssessmentAdmin(admin.ModelAdmin):
    list_display = (
        "assigned_to",
        "status",
        "estimated_value",
        "assessed_value",
        "created_at",
    )
    list_filter = ("status", "assigned_to", "created_at")
    search_fields = ("assigned_to",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)


# ---------------------------------
# Client Information Admin
# ---------------------------------
@admin.register(ClientInformation)
class ClientInformationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "contact",
        "email",
        "created_at",
    )
    search_fields = ("name", "email", "contact")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)


# ---------------------------------
# Details Admin
# ---------------------------------
@admin.register(Details)
class DetailsAdmin(admin.ModelAdmin):
    list_display = (
        "valuation_id",
        "status",
        "assigned_to",
        "created_at",
    )
    list_filter = ("status", "assigned_to", "created_at")
    search_fields = ("valuation_id",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)


# ---------------------------------
# Documents Admin
# ---------------------------------
@admin.register(Documents)
class DocumentsAdmin(admin.ModelAdmin):
    list_display = (
        "property_deed",
        "floor_plan",
        "owner_id",
        "uploaded_at",
    )
    readonly_fields = ("uploaded_at",)
    ordering = ("-uploaded_at",)


# ---------------------------------
# Recent Valuation Admin
# ---------------------------------
@admin.register(RecentValuation)
class RecentValuationAdmin(admin.ModelAdmin):
    list_display = (
        "valuation_id",
        "property",
        "location",
        "date",
        "estimated_value",
        "status",
        "action",
        "created_at",
    )
    list_filter = ("status", "action", "date")
    search_fields = ("valuation_id", "property", "location")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)