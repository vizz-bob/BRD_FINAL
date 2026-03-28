from django.contrib import admin
from .models import TenantUser

@admin.register(TenantUser)
class TenantUserAdmin(admin.ModelAdmin):

    list_display = (
        "first_name",
        "role_id",
        "email",
        "mobile_number",
        "role_type",
        "account_status",
        "action",
        "is_active",
        "created_at",
    )

    list_filter = (
        "role_type",
        "account_status",
        "is_active",
        "created_at",
    )

    search_fields = (
        "first_name",
        "last_name",
        "email",
        "mobile_number",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )

    fieldsets = (
        ("Personal Details", {
            "fields": (
                "first_name",
                "last_name",
                "email",
                "mobile_number",
            )
        }),
        ("Role & Access", {
            "fields": (
                "role_type",
                "role_id",
            )
        }),
        ("Account Settings", {
            "fields": (
                "account_status",
                "action",
                "is_active",
                "password",
            )
        }),
        ("System Info", {
            "fields": (
                "created_at",
            )
        }),
    )
