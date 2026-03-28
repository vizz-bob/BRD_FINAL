from django.contrib import admin
from .models import InterestConfiguration


@admin.register(InterestConfiguration)
class InterestConfigurationAdmin(admin.ModelAdmin):
    list_display = (
        "benchmark_type",
        "benchmark_frequency",
        "benchmark_rate",
        "mark_up",
        "interest_type",
        "accrual_stage",
        "accrual_method",
        "interest_rate",
        "is_active",
        "created_at",
    )

    list_filter = (
        "benchmark_type",
        "benchmark_frequency",
        "interest_type",
        "accrual_stage",
        "accrual_method",
        "is_active",
    )

    readonly_fields = ("created_at",)
