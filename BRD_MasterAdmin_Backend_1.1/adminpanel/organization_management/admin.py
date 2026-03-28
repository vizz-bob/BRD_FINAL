from django.contrib import admin
from .models import Organization, Branch


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        "business_name",
        "email",
        "mobile_number",
        "contact_person",
        "is_active",
        "created_at",
    )
    search_fields = ("business_name", "email", "mobile_number")
    list_filter = ("is_active",)
    ordering = ("-created_at",)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = (
        "branch_name",
        "branch_code",
        "organization",
        "tenant_id",
        "is_active",
        "created_at",
    )
    search_fields = ("branch_name", "branch_code", "tenant_id")
    list_filter = ("is_active",)
    ordering = ("-created_at",)
