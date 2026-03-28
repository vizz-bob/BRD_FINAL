# lms/admin.py
from django.contrib import admin
from .models import LoanAccount, Repayment, Collection

@admin.register(LoanAccount)
class LoanAccountAdmin(admin.ModelAdmin):
    list_display = ('account_id', 'loan_application', 'disbursed_at', 'outstanding_principal')
    search_fields = ('account_id', 'loan_application__application_id')

@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = ('loan_account', 'amount', 'paid_at', 'transaction_reference')
    search_fields = ('transaction_reference',)

@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ('loan_account', 'collector', 'amount', 'collected_at')
    search_fields = ('collector__email',)
