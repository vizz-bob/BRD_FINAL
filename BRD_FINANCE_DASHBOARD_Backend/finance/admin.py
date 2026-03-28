from django.contrib import admin
from .models import Dashboard

# from .models import QuickAction

# admin.site.register(QuickAction)



from .models import Tenant, Setting, Loan, Disbursement, ReconciliationTransaction, Repayment, PaymentRecord, Reminder

# from .models import Tenant, Setting, Disbursement, ReconciliationTransaction, Repayment, PaymentRecord, Reminder, Dashboard
# from django.db.models import Sum


# @admin.register(Dashboard)
# class DashboardAdmin(admin.ModelAdmin):
#     # change_list_template = "admin/dashboard.html"

#     def has_add_permission(self, request):
#         return False

#     def has_delete_permission(self, request, obj=None):
#         return False

#     def changelist_view(self, request, extra_context=None):

#         total_disbursed = Disbursement.objects.aggregate(
#             total=Sum('amount')
#         )['total'] or 0

#         pending_disbursement = Disbursement.objects.filter(
#             status='Pending'
#         ).aggregate(total=Sum('amount'))['total'] or 0

#         total_repayments = Repayment.objects.count()
#         paid_repayments = Repayment.objects.filter(status='Paid').count()

#         collection_rate = 0
#         if total_repayments > 0:
#             collection_rate = round((paid_repayments / total_repayments) * 100)

#         overdue_amount = Repayment.objects.filter(
#             status='Overdue'
#         ).aggregate(total=Sum('amount_due'))['total'] or 0

#         extra_context = extra_context or {}
#         extra_context['total_disbursed'] = total_disbursed
#         extra_context['pending_disbursement'] = pending_disbursement
#         extra_context['collection_rate'] = collection_rate
#         extra_context['overdue_amount'] = overdue_amount

#         return super().changelist_view(request, extra_context=extra_context)

# @admin.register(Dashboard)
# class DashboardAdmin(admin.ModelAdmin):

#     def has_add_permission(self, request):
#         return False

#     def has_delete_permission(self, request, obj=None):
#         return False

#     def changelist_view(self, request, extra_context=None):

#         from django.db.models import Sum

#         total_disbursed = Disbursement.objects.aggregate(
#             total=Sum('amount')
#         )['total'] or 0

#         pending_disbursement = Disbursement.objects.filter(
#             status='Pending'
#         ).aggregate(total=Sum('amount'))['total'] or 0

#         total_repayments = Repayment.objects.count()
#         paid_repayments = Repayment.objects.filter(status='Paid').count()

#         collection_rate = 0
#         if total_repayments > 0:
#             collection_rate = round((paid_repayments / total_repayments) * 100)

#         overdue_amount = Repayment.objects.filter(
#             status='Overdue'
#         ).aggregate(total=Sum('amount_due'))['total'] or 0

#         self.message_user(request, f"Total Disbursed: ₹{total_disbursed}")
#         self.message_user(request, f"Pending Disbursement: ₹{pending_disbursement}")
#         self.message_user(request, f"Collection Rate: {collection_rate}%")
#         self.message_user(request, f"Overdue Amount: ₹{overdue_amount}")

#         return super().changelist_view(request, extra_context)

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = (
        'total_disbursed',
        'pending_disbursement',
        'collection_rate',
        'overdue_amount',
        'created_at'
    )




@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'email', 'active')

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('loan_id', 'borrower_name', 'loan_amount')

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_notifications', 'sms_notifications')

# @admin.register(Disbursement)
# class DisbursementAdmin(admin.ModelAdmin):
#     list_display = ('disbursement_id', 'loan_id', 'recipient_name', 'amount', 'date', 'status', 'payment_method')

@admin.register(Disbursement)
class DisbursementAdmin(admin.ModelAdmin):
    list_display = (
        'disbursement_id',
        'loan',   # ✅ changed here
        'recipient_name',
        'amount',
        'date',
        'status',
        'payment_method'
    )

@admin.register(ReconciliationTransaction)
class ReconciliationTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'transaction_date', 'description', 'amount', 'status')

# @admin.register(Repayment)
# class RepaymentAdmin(admin.ModelAdmin):
#     list_display = ('repayment_id', 'loan_id', 'borrower_name', 'amount_due', 'due_date', 'status', 'repayment_type', 'paid_date')

@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = ('repayment_id', 'loan', 'borrower_name', 'amount_due', 'due_date', 'status', 'repayment_type', 'paid_date')

@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ('repayment', 'amount', 'recorded_at')

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('repayment', 'method', 'sent_at')


# from django.contrib import admin
# from .models import (
#     Tenant,
#     Setting,
#     Loan,
#     Disbursement,
#     ReconciliationTransaction,
#     Repayment,
#     PaymentRecord,
#     Reminder,
# )


# @admin.register(Tenant)
# class TenantAdmin(admin.ModelAdmin):
#     list_display = ('name', 'type', 'email', 'active')


# @admin.register(Setting)
# class SettingAdmin(admin.ModelAdmin):
#     list_display = ('user', 'email_notifications', 'sms_notifications')


# # ✅ Loan Admin (New)
# @admin.register(Loan)
# class LoanAdmin(admin.ModelAdmin):
#     list_display = ('loan_id',)


# # ✅ Updated Disbursement Admin
# @admin.register(Disbursement)
# class DisbursementAdmin(admin.ModelAdmin):
#     list_display = (
#         'disbursement_id',
#         'loan',   # ForeignKey dropdown
#         'recipient_name',
#         'amount',
#         'date',
#         'status',
#         'payment_method'
#     )


# @admin.register(ReconciliationTransaction)
# class ReconciliationTransactionAdmin(admin.ModelAdmin):
#     list_display = (
#         'transaction_id',
#         'transaction_date',
#         'description',
#         'amount',
#         'status'
#     )


# @admin.register(Repayment)
# class RepaymentAdmin(admin.ModelAdmin):
#     list_display = (
#         'repayment_id',
#         'loan_id',
#         'borrower_name',
#         'amount_due',
#         'due_date',
#         'status',
#         'repayment_type',
#         'paid_date'
#     )


# @admin.register(PaymentRecord)
# class PaymentRecordAdmin(admin.ModelAdmin):
#     list_display = ('repayment', 'amount', 'recorded_at')


# @admin.register(Reminder)
# class ReminderAdmin(admin.ModelAdmin):
#     list_display = ('repayment', 'method', 'sent_at')