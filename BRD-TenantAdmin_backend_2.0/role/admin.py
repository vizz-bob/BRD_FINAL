from django.contrib import admin
from .models import Role

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "role_name",
        "role_type",
        "role_status",
        "created_at",
    )
    list_filter = ("role_status", "role_type")
    search_fields = ("role_name", "description")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    fieldsets = (
        ("Role Details", {
            "fields": (
                "role_type",
                "role_name",
                "description",
                "role_status",
            )
        }),
        ("Permissions", {
            "fields": (
                "loan_management",
                "document_management",
                "system_administration",
                "analytics_reports",
                "branch_control",
            )
        }),
        ("System Info", {
            "fields": ("created_at",),
        }),
    )
