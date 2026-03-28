from django.contrib import admin
from .models import Penalty


@admin.register(Penalty)
class PenaltyAdmin(admin.ModelAdmin):
    list_display = (
        "penalty_name",
        "frequency",
        "basis_of_recovery",
        "recovery_stage",
        "recovery_mode",
        "rate_of_penalty",
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

    search_fields = ("penalty_name",)
    readonly_fields = ("created_at",)
