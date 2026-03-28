from django.db import models
from los.models import LoanApplication


class Mandate(models.Model):

    ENACH_STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    loan_application = models.OneToOneField(
        LoanApplication,
        on_delete=models.CASCADE,
        related_name="mandate",
        null=True,
        blank=True,
    )

    customer_name = models.CharField(max_length=100)
    bank_name = models.CharField(max_length=100)

    penny_drop_status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    enach_status = models.CharField(max_length=100, choices=STATUS_CHOICES,)

    action = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
    )

    failure_reason = models.TextField(blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        loan_id = getattr(self.loan_application, "id", "None")
        return f"Mandate - {loan_id}"
