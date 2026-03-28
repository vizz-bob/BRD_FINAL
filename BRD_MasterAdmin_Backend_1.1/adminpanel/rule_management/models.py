import uuid
from django.db import models


STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)


# ---------------- RULE MASTER ----------------
class RuleMaster(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule_name = models.CharField(max_length=200)
    rule_code = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- IMPACT VALUES ----------------
class ImpactValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule = models.ForeignKey(RuleMaster, on_delete=models.CASCADE)
    impact_type = models.CharField(max_length=50)  # Positive / Negative
    impact_value = models.CharField(max_length=100)
    risk_impact = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- CLIENT PROFILE RULES ----------------
class ClientProfileRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule_name = models.CharField(max_length=200)
    parameter = models.CharField(max_length=200)
    condition = models.CharField(max_length=100)
    value = models.CharField(max_length=200)
    impact_value = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)




# ---------------- COLLATERAL QUALITY ----------------
class CollateralQualityRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collateral_type = models.CharField(max_length=200)
    ownership = models.CharField(max_length=100)
    min_market_value = models.DecimalField(max_digits=14, decimal_places=2)
    max_market_value = models.DecimalField(max_digits=14, decimal_places=2)
    allowed_ltv = models.CharField(max_length=50)
    risk_level = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- FINANCIAL ELIGIBILITY ----------------
class FinancialEligibilityRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    income_type = models.CharField(max_length=100)
    min_monthly_income = models.DecimalField(max_digits=14, decimal_places=2)
    max_emi_ratio = models.CharField(max_length=50)
    min_bank_balance = models.DecimalField(max_digits=14, decimal_places=2)
    max_existing_obligation = models.DecimalField(max_digits=14, decimal_places=2)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- CREDIT HISTORY SCORECARD ----------------
class CreditHistoryRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    credit_bureau = models.CharField(max_length=100)
    min_credit_score = models.IntegerField()
    max_dpd_days = models.IntegerField()
    max_enquiries = models.IntegerField()
    risk_level = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- INTERNAL SCORECARD ----------------
class InternalScoreRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parameter = models.CharField(max_length=200)
    min_value = models.CharField(max_length=100)
    weight = models.CharField(max_length=50)
    risk_level = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- GEO LOCATION SCORECARD ----------------
class GeoLocationRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    risk_level = models.CharField(max_length=50)
    weight = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- RISK MITIGATION ----------------
class RiskMitigationRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    risk_parameter = models.CharField(max_length=200)
    mitigation_action = models.CharField(max_length=200)
    severity = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- INTERNAL VERIFICATION ----------------
class InternalVerificationRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    verification_type = models.CharField(max_length=100)
    criteria = models.CharField(max_length=200)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


# ---------------- AGENCY VERIFICATION ----------------
class AgencyVerificationRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agency_type = models.CharField(max_length=100)
    verification_stage = models.CharField(max_length=100)
    report_type = models.CharField(max_length=200)
    turnaround_time = models.CharField(max_length=50)
    remarks = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
