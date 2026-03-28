from django.db import models
import uuid


class Charge(models.Model):
    """
    Charges Management
    ------------------
    Sets up charges beyond interest and fees.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    charge_name = models.CharField(max_length=100)

    FREQUENCY_CHOICES = (
        ("ONE_TIME", "One-time"),
        ("RECURRING", "Recurring"),
    )
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)

    BASIS_OF_RECOVERY_CHOICES = (
        ("FIXED", "Fixed"),
        ("SLAB", "Slab"),
        ("VARIABLE", "Variable"),
    )
    basis_of_recovery = models.CharField(
        max_length=20, choices=BASIS_OF_RECOVERY_CHOICES
    )

    RECOVERY_STAGE_CHOICES = (
        ("ONBOARDING", "Onboarding"),
        ("POST_DISBURSEMENT", "Post-disbursement"),
    )
    recovery_stage = models.CharField(
        max_length=30, choices=RECOVERY_STAGE_CHOICES
    )

    RECOVERY_MODE_CHOICES = (
        ("AUTO", "Auto"),
        ("MANUAL", "Manual"),
    )
    recovery_mode = models.CharField(
        max_length=20, choices=RECOVERY_MODE_CHOICES
    )

    rate_of_charges = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "charges"
        ordering = ["-created_at"]

    def __str__(self):
        return self.charge_name
