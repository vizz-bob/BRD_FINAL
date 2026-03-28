from django.db import models
import uuid
from tenants.models import Tenant


# ─────────────────────────────────────────────
# 1. RULE MASTER  (engine types + impact values)
# ─────────────────────────────────────────────
class RuleMaster(models.Model):
    RULE_CODES = [
        ("CLIENT_PROFILE", "Client Profile Engine"),
        ("COLLATERAL",     "Collateral Quality Engine"),
        ("FINANCIAL",      "Financial Eligibility Engine"),
        ("SCORECARD",      "Score Card Engine"),
        ("VERIFICATION",   "Verification Engine"),
        ("RISK",           "Risk & Mitigation Engine"),
    ]
    STATUS = [("Active", "Active"), ("Inactive", "Inactive")]

    rule_name   = models.CharField(max_length=255)
    rule_code   = models.CharField(max_length=50, choices=RULE_CODES)
    rule_type   = models.CharField(max_length=50, blank=True, null=True) # Knockout, scoring, advisory
    product     = models.CharField(max_length=100, blank=True, null=True)
    segment     = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True)
    status      = models.CharField(max_length=20, choices=STATUS, default="Active")
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_rule_master"

    def __str__(self):
        return self.rule_name


class ImpactValue(models.Model):
    STATUS = [("Active", "Active"), ("Inactive", "Inactive")]

    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label       = models.CharField(max_length=100)
    value       = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    status      = models.CharField(max_length=20, choices=STATUS, default="Active")
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_impact_values"

    def __str__(self):
        return f"{self.label} ({self.value})"


# ─────────────────────────────────────────────
# 2. CLIENT PROFILE RULES
# ─────────────────────────────────────────────
class ClientProfileRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule_name    = models.CharField(max_length=255)
    parameter    = models.CharField(max_length=100)
    condition    = models.CharField(max_length=100)
    value        = models.CharField(max_length=255)
    impact_value = models.CharField(max_length=100)
    status       = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_client_profile_rules"

    def __str__(self):
        return self.rule_name


# ─────────────────────────────────────────────
# 3. FINANCIAL ELIGIBILITY RULES
# ─────────────────────────────────────────────
class FinancialEligibilityRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id                      = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    income_type             = models.CharField(max_length=100)
    min_monthly_income      = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    min_business_income     = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    min_annual_turnover     = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    min_bank_balance        = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    cash_flow_threshold     = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    max_emi_ratio           = models.CharField(max_length=20)   # FOIR Limit
    itr_required            = models.BooleanField(default=False)
    cash_flow_check         = models.BooleanField(default=False)
    compliance_check        = models.BooleanField(default=False)
    status                  = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    remarks                 = models.TextField(blank=True)
    created_at              = models.DateTimeField(auto_now_add=True)
    updated_at              = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_financial_eligibility_rules"

    def __str__(self):
        return f"{self.income_type} – {self.min_monthly_income}"


# ─────────────────────────────────────────────
# 4. COLLATERAL QUALITY RULES
# ─────────────────────────────────────────────
class CollateralQualityRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collateral_type  = models.CharField(max_length=100)
    ownership        = models.CharField(max_length=100)
    min_market_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    max_market_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    allowed_ltv      = models.CharField(max_length=20)
    risk_level       = models.CharField(max_length=50)
    status           = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_collateral_quality_rules"

    def __str__(self):
        return f"{self.collateral_type} – {self.risk_level}"


# ─────────────────────────────────────────────
# 5. SCORECARD – CREDIT HISTORY RULES
# ─────────────────────────────────────────────
class CreditHistoryRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    credit_bureau    = models.CharField(max_length=100)
    min_credit_score = models.IntegerField(default=0)
    max_dpd_days     = models.IntegerField(default=0)
    max_enquiries    = models.IntegerField(default=0)
    risk_level       = models.CharField(max_length=50)
    status           = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    remarks          = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_credit_history_rules"

    def __str__(self):
        return f"{self.credit_bureau} – {self.min_credit_score}"


# ─────────────────────────────────────────────
# 6. SCORECARD – INTERNAL SCORE RULES
# ─────────────────────────────────────────────
class InternalScoreRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parameter  = models.CharField(max_length=100)
    min_value  = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    weight     = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    risk_level = models.CharField(max_length=50)
    status     = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_internal_score_rules"

    def __str__(self):
        return f"{self.parameter} – {self.weight}%"


# ─────────────────────────────────────────────
# 7. SCORECARD – GEO LOCATION RULES
# ─────────────────────────────────────────────
class GeoLocationRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    state      = models.CharField(max_length=100)
    city       = models.CharField(max_length=100)
    pincode    = models.IntegerField()
    risk_level = models.CharField(max_length=50)
    weight     = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    status     = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    remarks    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_geo_location_rules"

    def __str__(self):
        return f"{self.state} / {self.city}"


# ─────────────────────────────────────────────
# 8. RISK MITIGATION RULES
# ─────────────────────────────────────────────
class RiskMitigationRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    risk_parameter    = models.CharField(max_length=255)
    mitigation_action = models.TextField()
    severity          = models.CharField(max_length=50)
    status            = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    remarks           = models.TextField(blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_risk_mitigation_rules"

    def __str__(self):
        return self.risk_parameter


# ─────────────────────────────────────────────
# 9. VERIFICATION – INTERNAL
# ─────────────────────────────────────────────
class InternalVerificationRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    verification_type = models.CharField(max_length=255)
    criteria          = models.TextField()
    turnaround_days   = models.IntegerField(default=0)
    flag_mismatch     = models.BooleanField(default=False)
    flag_duplicate_pan= models.BooleanField(default=False)
    status            = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_internal_verification_rules"

    def __str__(self):
        return self.verification_type


# ─────────────────────────────────────────────
# 10. VERIFICATION – AGENCY
# ─────────────────────────────────────────────
class AgencyVerificationRule(models.Model):
    STATUS = [("ACTIVE", "Active"), ("INACTIVE", "Inactive")]

    id                 = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agency_name        = models.CharField(max_length=255, blank=True, null=True)
    agency_level       = models.CharField(max_length=100, blank=True, null=True)
    agency_type        = models.CharField(max_length=255)
    verification_stage = models.CharField(max_length=255)
    report_type        = models.CharField(max_length=255)
    turnaround_time    = models.IntegerField(default=0)    # in hours
    status             = models.CharField(max_length=20, choices=STATUS, default="ACTIVE")
    remarks            = models.TextField(blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rm_agency_verification_rules"

    def __str__(self):
        return f"{self.agency_type} – {self.verification_stage}"


# ─────────────────────────────────────────────
# (Keep the original TenantRuleConfig for rules.jsx)
# ─────────────────────────────────────────────
class TenantRuleConfig(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant     = models.OneToOneField(
        Tenant, null=True, blank=True,
        on_delete=models.CASCADE,
        related_name="rule_management_config"
    )
    config     = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rulemanagement_tenant_rules"

    def __str__(self):
        return f"Rules for {self.tenant_id}"
