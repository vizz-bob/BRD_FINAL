from django.db import models
import uuid


class InterestConfiguration(models.Model):
    """
    Interest Management
    -------------------
    Manages interest configurations including APR, accrual methods, and benchmarks.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # -------- Benchmark Configuration --------
    BENCHMARK_TYPE_CHOICES = (
        ("MCLR", "MCLR"),
        ("RBI_RATE", "RBI Rate"),
        ("BASE_RATE", "Base Rate"),
    )
    benchmark_type = models.CharField(
        max_length=30, choices=BENCHMARK_TYPE_CHOICES
    )

    BENCHMARK_FREQUENCY_CHOICES = (
        ("MONTHLY", "Monthly"),
        ("QUARTERLY", "Quarterly"),
    )
    benchmark_frequency = models.CharField(
        max_length=20, choices=BENCHMARK_FREQUENCY_CHOICES
    )

    benchmark_rate = models.DecimalField(
        max_digits=5, decimal_places=2
    )

    mark_up = models.DecimalField(
        max_digits=5, decimal_places=2
    )

    # -------- Interest Configuration --------
    INTEREST_TYPE_CHOICES = (
        ("FIXED", "Fixed"),
        ("FLOATING", "Floating"),
    )
    interest_type = models.CharField(
        max_length=20, choices=INTEREST_TYPE_CHOICES
    )

    ACCRUAL_STAGE_CHOICES = (
        ("PRE_EMI", "Pre-EMI"),
        ("POST_EMI", "Post-EMI"),
    )
    accrual_stage = models.CharField(
        max_length=20, choices=ACCRUAL_STAGE_CHOICES
    )

    ACCRUAL_METHOD_CHOICES = (
        ("SIMPLE", "Simple"),
        ("COMPOUND", "Compound"),
    )
    accrual_method = models.CharField(
        max_length=20, choices=ACCRUAL_METHOD_CHOICES
    )

    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text="Interest Rate (% per annum)"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "interest_configurations"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.benchmark_type} - {self.interest_rate}%"
