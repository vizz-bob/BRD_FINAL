from django.contrib import admin

# Register your models here.
from .models import Lead,CRMTool

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "loan_type",
        "amount",
        "stage",
        "assigned_to",
        "created_at",
    )

    list_filter = (
        "stage",
        "loan_type",
        "assigned_to",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "phone",
    )

    ordering = ("-created_at",)

    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Lead Information", {
            "fields": ("name", "email", "phone")
        }),
        ("Loan Details", {
            "fields": ("loan_type", "amount")
        }),
        ("Pipeline", {
            "fields": ("stage", "assigned_to")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )
@admin.register(CRMTool)
class CRMToolAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "status",
        "sync_frequency",
        "last_synced_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "name",
    )

    readonly_fields = (
        "last_synced_at",
    )

    fieldsets = (
        ("CRM Tool Info", {
            "fields": ("name", "description")
        }),
        ("Sync Configuration", {
            "fields": ("status", "sync_frequency")
        }),
        ("System Info", {
            "fields": ("last_synced_at",)
        }),
    )