from django.contrib import admin
from .models import Charge


@admin.register(Charge)
class ChargeAdmin(admin.ModelAdmin):
    list_display = (
        "charge_name",
        "frequency",
        "basis_of_recovery",
        "recovery_stage",
        "recovery_mode",
        "rate_of_charges",
        "is_active",
        "created_at",
    )

    list_filter = (
        "frequency",
        "basis_of_recovery",
        "recovery_stage",
        "recovery_mode",
        "is_active",
    )

    search_fields = ("charge_name",)
    readonly_fields = ("created_at",)
