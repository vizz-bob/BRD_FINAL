from django.db import models
import uuid


class Moratorium(models.Model):
    """
    Moratorium Management
    ---------------------
    Manages deferral of payments and its impact.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    MORATORIUM_TYPE_CHOICES = (
        ("FULL", "Full"),
        ("INTEREST_ONLY", "Interest-only"),
    )
    moratorium_type = models.CharField(
        max_length=20, choices=MORATORIUM_TYPE_CHOICES
    )

    period_value = models.PositiveIntegerField(
        help_text="Duration value of moratorium"
    )

    PERIOD_UNIT_CHOICES = (
        ("DAY", "Day"),
        ("MONTH", "Month"),
    )
    period_unit = models.CharField(
        max_length=10, choices=PERIOD_UNIT_CHOICES
    )

    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        help_text="Amount under moratorium"
    )

    EFFECT_OF_MORATORIUM_CHOICES = (
        ("INTEREST_ONLY", "Interest-only"),
        ("DEFERRED", "Deferred"),
    )
    effect_of_moratorium = models.CharField(
        max_length=20, choices=EFFECT_OF_MORATORIUM_CHOICES
    )

    interest_rationalisation = models.BooleanField(
        default=False,
        help_text="If interest is waived during moratorium"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "moratoriums"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.moratorium_type} ({self.period_value} {self.period_unit})"
