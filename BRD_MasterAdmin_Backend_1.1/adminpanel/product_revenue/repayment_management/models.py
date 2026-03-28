from django.db import models
import uuid


class RepaymentConfiguration(models.Model):
    """
    Repayment Management
    --------------------
    Defines how and when customers repay loans.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Repayment basics
    REPAYMENT_TYPE_CHOICES = (
        ("EMI", "EMI"),
        ("BULLET", "Bullet"),
        ("STEP_UP", "Step-up"),
    )
    repayment_type = models.CharField(
        max_length=20, choices=REPAYMENT_TYPE_CHOICES
    )

    FREQUENCY_CHOICES = (
        ("MONTHLY", "Monthly"),
        ("BI_WEEKLY", "Bi-weekly"),
    )
    frequency = models.CharField(
        max_length=20, choices=FREQUENCY_CHOICES
    )

    limit_in_month = models.PositiveIntegerField(
        help_text="Total months of repayment"
    )

    gap_between_disbursement_and_first_repayment = models.PositiveIntegerField(
        help_text="Gap (in months) between disbursement and first repayment"
    )

    number_of_repayments = models.PositiveIntegerField(
        help_text="Total number of installments"
    )

    SEQUENCE_OF_ADJUSTMENT_CHOICES = (
        ("PRINCIPAL_FIRST", "Principal First"),
        ("INTEREST_FIRST", "Interest First"),
    )
    sequence_of_repayment_adjustment = models.CharField(
        max_length=30, choices=SEQUENCE_OF_ADJUSTMENT_CHOICES
    )

    # Repayment scheduling
    repayment_months = models.JSONField(
        default=list,
        help_text="Allowed repayment months (e.g. Jan, Feb)"
    )

    repayment_days = models.JSONField(
        default=list,
        help_text="Allowed days of the week (e.g. Monday)"
    )

    repayment_dates = models.JSONField(
        default=list,
        help_text="Allowed dates (e.g. 1st, 5th, 10th)"
    )

    COLLECTION_MODE_CHOICES = (
        ("NACH", "NACH"),
        ("CASH", "Cash"),
        ("ONLINE", "Online"),
    )
    mode_of_collection = models.CharField(
        max_length=20, choices=COLLECTION_MODE_CHOICES
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "repayment_configurations"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.repayment_type} - {self.frequency}"
