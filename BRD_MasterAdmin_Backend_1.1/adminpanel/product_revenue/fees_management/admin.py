from django.contrib import admin
from .models import Fee


@admin.register(Fee)
class FeeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "fees_frequency",
        "basis_of_fees",
        "fees_recovery_stage",
        "fees_recovery_mode",
        "fees_rate",
        "is_active",
        "created_at",
    )

    list_filter = (
        "fees_frequency",
        "basis_of_fees",
        "fees_recovery_stage",
        "fees_recovery_mode",
        "is_active",
    )

    search_fields = ("name",)
    readonly_fields = ("created_at",)
