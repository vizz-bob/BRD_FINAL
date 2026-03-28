from django.db import models
from disbursement.models import LoanAccount as DisbursementLoanAccount


class LMSLoanAccount(models.Model):
    loan_application = models.OneToOneField(
        DisbursementLoanAccount,
        on_delete=models.CASCADE,
        related_name="lms_account"
    )
    borrower = models.CharField(max_length=255)

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    penny_drop_status = models.CharField(
        max_length=10,
        choices=[
            ("PENDING", "Pending"),
            ("SUCCESS", "Success"),
            ("FAILED", "Failed"),
        ],
        default="PENDING"
    )

    enach_status = models.CharField(
        max_length=10,
        choices=[
            ("PENDING", "Pending"),
            ("SUCCESS", "Success"),
            ("FAILED", "Failed"),
        ],
        default="PENDING"
    )
    action = models.CharField(
        max_length=10,
        choices=[
            ("PENDING", "Pending"),
            ("SUCCESS", "Success"),
            ("FAILED", "Failed"),
        ],
       
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"LMS-{self.id}"
