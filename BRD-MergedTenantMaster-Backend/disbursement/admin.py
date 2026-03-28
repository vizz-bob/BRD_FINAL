from django.contrib import admin
from .models import LoanAccount

@admin.register(LoanAccount)
class LoanAccountAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'loan_application',
        'amount',
        'bank_detail',
        'penny_drop_status',
        'enach_status',
        'created_at',
    )

    list_filter = (
        'penny_drop_status',
        'enach_status',
    )

    search_fields = (
        'loan_application__application_id',
    )
