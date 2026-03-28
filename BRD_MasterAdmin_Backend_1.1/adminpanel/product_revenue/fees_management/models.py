from django.db import models
import uuid


class Fee(models.Model):
    """
    Fees Management
    ----------------
    Defines how fees are applied and recovered for products.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=100)  # Processing Fee, Documentation Fee

    FEES_FREQUENCY_CHOICES = (  
        ("ONE_TIME", "One-time"),
        ("MONTHLY", "Monthly"),
        ("ANNUALLY", "Annually"),
    )
    fees_frequency = models.CharField(max_length=20, choices=FEES_FREQUENCY_CHOICES)

    BASIS_OF_FEES_CHOICES = (
        ("FIXED", "Fixed"),
        ("PERCENTAGE", "Percentage"),
        ("SLAB", "Slab-based"),
    )
    basis_of_fees = models.CharField(max_length=20, choices=BASIS_OF_FEES_CHOICES)

    FEES_RECOVERY_STAGE_CHOICES = (
        ("DISBURSEMENT", "Disbursement"),
        ("ONGOING", "Ongoing"),
        ("CLOSURE", "Closure"),
    )
    fees_recovery_stage = models.CharField(
        max_length=20, choices=FEES_RECOVERY_STAGE_CHOICES
    )

    FEES_RECOVERY_MODE_CHOICES = (
        ("DIRECT_DEBIT", "Direct Debit"),
        ("AUTO_DEBIT", "Auto-debit"),
        ("CASH", "Cash"),
    )
    fees_recovery_mode = models.CharField(
        max_length=20, choices=FEES_RECOVERY_MODE_CHOICES
    )

    fees_rate = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "fees"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
