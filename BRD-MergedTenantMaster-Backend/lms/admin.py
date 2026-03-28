# lms/admin.py

from django.contrib import admin
from .models import LoanAccount, Repayment, Collection


@admin.register(LoanAccount)
class LoanAccountAdmin(admin.ModelAdmin):
    list_display = (
        'account_id',
        'loan_application',
        'outstanding_principal',
        'emi_amount',
        'tenor_months',
        'interest_rate',
        'disbursed_at',
        'created_at',
    )
    list_filter = ('disbursed_at', 'created_at')
    search_fields = ('account_id', 'loan_application__id')
    ordering = ('-created_at',)
    readonly_fields = ('account_id', 'created_at')


@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = (
        'loan_account',
        'amount',
        'paid_at',
        'transaction_reference',
    )
    list_filter = ('paid_at',)
    search_fields = ('loan_account__account_id', 'transaction_reference')
    ordering = ('-paid_at',)
    readonly_fields = ('paid_at',)


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = (
        'loan_account',
        'collector',
        'amount',
        'collected_at',
    )
    list_filter = ('collected_at', 'collector')
    search_fields = ('loan_account__account_id', 'collector__username')
    ordering = ('-collected_at',)
    readonly_fields = ('collected_at',)