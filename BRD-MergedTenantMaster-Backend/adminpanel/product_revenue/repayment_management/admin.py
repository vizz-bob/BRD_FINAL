from django.contrib import admin
from .models import RepaymentConfiguration


@admin.register(RepaymentConfiguration)
class RepaymentConfigurationAdmin(admin.ModelAdmin):
    list_display = (
        "repayment_type",
        "frequency",
        "limit_in_month",
        "number_of_repayments",
        "sequence_of_repayment_adjustment",
        "mode_of_collection",
        "is_active",
        "created_at",
    )

    list_filter = (
        "repayment_type",
        "frequency",
        "sequence_of_repayment_adjustment",
        "mode_of_collection",
        "is_active",
    )

    readonly_fields = ("created_at",)
