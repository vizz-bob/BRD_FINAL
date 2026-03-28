from django.contrib import admin
from .models import Delinquency


@admin.register(Delinquency)
class DelinquencyAdmin(admin.ModelAdmin):
    list_display = (
        "loan_account_id",
        "borrower_name",
        "dpd",
        "bucket",
        "overdue_amount",
        "action_type",
        "created_at",
    )

    search_fields = ("loan_account_id", "borrower_name")
    list_filter = ("bucket", "action_type")
