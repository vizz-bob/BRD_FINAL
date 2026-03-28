import uuid
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class LoanImprovementRequest(models.Model):
    """
    MASTER TABLE – one entry per improvement request
    """
    IMPROVEMENT_TYPE_CHOICES = [
        ("INTEREST_RATE", "Change Interest Rate"),
        ("TENURE", "Change Repayment Period"),
        ("EMI", "Change EMI"),
        ("PRODUCT", "Change Loan Product"),
        ("FEES", "Change Fees & Charges"),
        ("COLLATERAL", "Change Collateral"),
        ("RATIONALISATION", "Repayment Rationalisation"),
        ("MORATORIUM", "Moratorium of Interest"),
        ("TOP_UP", "Top Up"),
    ]

    STATUS_CHOICES = [
        ("PENDING", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("APPLIED", "Applied"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan_id = models.CharField(max_length=50)
    improvement_type = models.CharField(max_length=30, choices=IMPROVEMENT_TYPE_CHOICES)

    requested_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="loan_improvements")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    effective_date = models.DateField()
    remarks = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

class InterestRateChange(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    old_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    revised_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)

class TenureChange(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    old_tenure = models.PositiveIntegerField()
    revised_tenure = models.PositiveIntegerField()
    tenure_unit = models.CharField(max_length=10, default="MONTHS")

class EMIChange(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    old_emi = models.DecimalField(max_digits=12, decimal_places=2)
    revised_emi = models.DecimalField(max_digits=12, decimal_places=2)

class ProductChange(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    old_product = models.CharField(max_length=100)
    new_product = models.CharField(max_length=100)

class FeeChange(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    fee_type = models.CharField(max_length=100)
    old_amount = models.DecimalField(max_digits=12, decimal_places=2)
    revised_amount = models.DecimalField(max_digits=12, decimal_places=2)

class CollateralChange(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    old_collateral_type = models.CharField(max_length=100)
    revised_collateral_value = models.DecimalField(max_digits=15, decimal_places=2)

class RepaymentRationalisation(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    rationalisation_type = models.CharField(max_length=100)
    duration = models.PositiveIntegerField()
    duration_unit = models.CharField(max_length=10)

class InterestMoratorium(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    moratorium_period = models.PositiveIntegerField()
    period_unit = models.CharField(max_length=10)
    revised_interest_rate = models.DecimalField(max_digits=5, decimal_places=2)

class TopUpRequest(models.Model):
    request = models.OneToOneField(LoanImprovementRequest, on_delete=models.CASCADE)
    revised_topup_limit = models.DecimalField(max_digits=15, decimal_places=2)
    required_vintage = models.PositiveIntegerField()
    vintage_unit = models.CharField(max_length=10)
