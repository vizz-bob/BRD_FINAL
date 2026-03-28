from django.db import models



class LoanAccount(models.Model):

    loan_application = models.OneToOneField(
        'banking.Mandate',
        on_delete=models.CASCADE,
        related_name="loan_account",
        null=True,
        blank=True
    )

    bank_detail = models.CharField(max_length=255)

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    ]

    enach_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    penny_drop_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    DISBURSEMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
    ]

    disbursement_status = models.CharField(
        max_length=15,
        choices=DISBURSEMENT_STATUS_CHOICES,
        default="PENDING"
    )

    failure_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
