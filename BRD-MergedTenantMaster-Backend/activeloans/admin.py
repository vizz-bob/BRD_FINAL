from django.contrib import admin
from .models import ActiveLoan


@admin.register(ActiveLoan)
class ActiveLoanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "loan_account",
        "product_type",
        "disbursed_amount",
        "outstanding",
        "status",
        "action",
        "next_emi",
        "created_at",
    )
    list_filter = ("status", "action", "product_type")
    search_fields = ("loan_account__id",)