from django.db import models
import uuid


class Penalty(models.Model):
    """
    Penalties Management
    --------------------
    Manages penalties for non-compliance, late payments, etc.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    penalty_name = models.CharField(max_length=100)

    FREQUENCY_CHOICES = (
        ("ONE_TIME", "One-time"),
        ("RECURRING", "Recurring"),
    )
    frequency = models.CharField(
        max_length=20, choices=FREQUENCY_CHOICES
    )

    BASIS_OF_RECOVERY_CHOICES = (
        ("FIXED", "Fixed"),
        ("PERCENTAGE", "Percentage"),
        ("SLAB", "Slab"),
    )
    basis_of_recovery = models.CharField(
        max_length=20, choices=BASIS_OF_RECOVERY_CHOICES
    )

    RECOVERY_STAGE_CHOICES = (
        ("MISSED_EMI", "Missed EMI"),
        ("POST_DEFAULT", "Post Default"),
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

    rate_of_penalty = models.DecimalField(
        max_digits=10, decimal_places=2,
        help_text="Penalty amount or percentage"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "penalties"
        ordering = ["-created_at"]

    def __str__(self):
        return self.penalty_name
