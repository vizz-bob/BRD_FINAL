# lms/models.py
from django.db import models
from django.conf import settings
import uuid

class LoanAccount(models.Model):
    account_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    loan_application = models.OneToOneField('los.LoanApplication', on_delete=models.CASCADE, related_name='loan_account')
    outstanding_principal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    emi_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    tenor_months = models.IntegerField(null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    disbursed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'loan_accounts'
        ordering = ['-created_at']

    def __str__(self):
        return str(self.account_id)

class Repayment(models.Model):
    loan_account = models.ForeignKey(LoanAccount, on_delete=models.CASCADE, related_name='repayments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    paid_at = models.DateTimeField(auto_now_add=True)
    transaction_reference = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'repayments'
        ordering = ['-paid_at']

    def __str__(self):
        return f"{self.loan_account} - {self.amount} - {self.paid_at}"

class Collection(models.Model):
    loan_account = models.ForeignKey(LoanAccount, on_delete=models.CASCADE, related_name='collections')
    collector = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    collected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'collections'
        ordering = ['-collected_at']
