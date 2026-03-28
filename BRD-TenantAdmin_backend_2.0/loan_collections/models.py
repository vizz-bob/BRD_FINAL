from django.db import models
from lms.models import LMSLoanAccount

class Delinquency(models.Model):
    loan_account = models.OneToOneField(
        LMSLoanAccount,
        on_delete=models.CASCADE,
        related_name="lms_account"
    )
    borrower_name = models.CharField(max_length=255)
    dpd = models.PositiveIntegerField()
    overdue_amount = models.DecimalField(max_digits=14, decimal_places=2)
    bucket = models.CharField(
        max_length=10,
        choices=[
            ("0-30", "0-30 DPD"),
            ("31-60", "31-60 DPD"),
            ("61-90", "61-90 DPD"),
            ("90+", "90+ DPD (NPA)"),
        ]
    )
    action_type = models.CharField(
        max_length=20,
        choices=[
            ("CALL", "Call Borrower"),
            ("VISIT", "Field Visit"),
            ("LEGAL", "Legal Notice"),
            ("SETTLED", "Settled"),
        ]
    )
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.loan_account} | {self.bucket}"
