import uuid
from django.db import models


STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)


# ---------------- RULE IDENTIFICATION & WEIGHTING ----------------
class RuleIdentification(models.Model):
    RULE_TYPE_CHOICES = (
        ("KNOCKOUT", "Knockout"),
        ("SCORING", "Scoring"),
        ("ADVISORY", "Advisory"),
    )

    APPLICABLE_PRODUCT_CHOICES = (
        ("ALL", "All Products"),
        ("PERSONAL", "Personal Loan"),
        ("BUSINESS", "Business Loan"),
        ("HOME", "Home Loan"),
    )

    BORROWER_SEGMENT_CHOICES = (
        ("ALL", "All Segments"),
        ("SALARIED", "Salaried"),
        ("SELF_EMPLOYED", "Self Employed"),
        ("CORPORATE", "Corporate"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rule_name = models.CharField(max_length=200)
    impact = models.CharField(max_length=200)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPE_CHOICES)
    applicable_product = models.CharField(max_length=20, choices=APPLICABLE_PRODUCT_CHOICES)
    borrower_segment = models.CharField(max_length=20, choices=BORROWER_SEGMENT_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.rule_name


# ---------------- CLIENT PROFILE RULES ----------------
class ClientProfileRule(models.Model):

    ADDRESS_CRITERIA_CHOICES = [
        ("RES_OFFICE", "Residence/Office Match"),
        ("ALLOW_MISMATCH", "Allow Mismatch"),
        ("ANY", "Any"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    applicant_min_age = models.PositiveIntegerField(default=21)
    applicant_max_age = models.PositiveIntegerField(default=60)
    co_applicant_min_age = models.PositiveIntegerField(default=18)
    co_applicant_max_age = models.PositiveIntegerField(default=65)

    employer_types = models.JSONField(default=list, blank=True)
    min_business_age = models.PositiveIntegerField(default=2)
    business_sectors = models.JSONField(default=list, blank=True)

    address_criteria = models.CharField(max_length=20, choices=ADDRESS_CRITERIA_CHOICES)
    pincode = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f"Pincode Rule - {self.pincode}"


# ---------------- FINANCIAL ELIGIBILITY ----------------
class FinancialEligibilityRule(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    min_monthly_income = models.DecimalField(max_digits=12, decimal_places=2)
    max_emi_ratio = models.DecimalField(max_digits=5, decimal_places=2)
    min_annual_turnover = models.DecimalField(max_digits=14, decimal_places=2)
    min_bank_balance = models.DecimalField(max_digits=12, decimal_places=2)
    cash_flow_threshold = models.DecimalField(max_digits=12, decimal_places=2)
    max_existing_obligation = models.DecimalField(max_digits=12, decimal_places=2)
    foir_limit = models.DecimalField(max_digits=5, decimal_places=2)

    itr_required = models.BooleanField(default=False)
    cash_flow_eligibility_check = models.BooleanField(default=False)
    financial_compliance_check = models.BooleanField(default=False)

    def __str__(self):
        return f"Income >= {self.min_monthly_income}"


# ---------------- COLLATERAL QUALITY ----------------
class CollateralQualityRule(models.Model):

    COLLATERAL_RELEVANCE_CHOICES = [
        ("MANDATORY", "Mandatory"),
        ("OPTIONAL", "Optional"),
        ("NOT_REQUIRED", "Not Required"),
    ]

    OWNERSHIP_VERIFICATION_CHOICES = [
        ("SELF_OWNED", "Self Owned"),
        ("CO_OWNED", "Co Owned"),
        ("ANY", "Any"),
    ]

    RISK_TYPE_CHOICES = [
        ("CREDIT", "Credit"),
        ("MARKET", "Market"),
        ("OPERATIONAL", "Operational"),
        ("COMPLIANCE", "Compliance"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    risk_type = models.CharField(max_length=50, choices=RISK_TYPE_CHOICES)
    collateral_relevance = models.CharField(max_length=20, choices=COLLATERAL_RELEVANCE_CHOICES)
    ownership_verification = models.CharField(max_length=20, choices=OWNERSHIP_VERIFICATION_CHOICES)

    min_estimated_value = models.DecimalField(max_digits=14, decimal_places=2)
    max_ltv_ratio = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.risk_type} - {self.collateral_relevance}"


# ---------------- CREDIT HISTORY SCORECARD ----------------
class AutomatedScorecard(models.Model):

    BUREAU_CHOICES = [
        ("CIBIL", "CIBIL"),
        ("EXPERIAN", "Experian"),
        ("EQUIFAX", "Equifax"),
        ("CRIF", "CRIF"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    bureau = models.CharField(max_length=20, choices=BUREAU_CHOICES)
    min_credit_score = models.IntegerField()
    max_dpd_days = models.IntegerField()
    max_enquiries = models.IntegerField()

    def __str__(self):
        return f"{self.bureau} Scorecard"


# ---------------- AGENCY VERIFICATION ----------------
class AgencyVerificationRule(models.Model):

    VERIFICATION_TYPE_CHOICES = [
        ("FIELD", "Field Verification"),
        ("TELE", "Tele Verification"),
        ("VIDEO_KYC", "Video KYC"),
    ]

    VERIFICATION_LEVEL_CHOICES = [
        ("BASIC", "Basic"),
        ("ENHANCED", "Enhanced"),
        ("PREMIUM", "Premium"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    verification_type = models.CharField(max_length=20, choices=VERIFICATION_TYPE_CHOICES)
    turnaround_time = models.CharField(max_length=50)
    agency_name = models.CharField(max_length=100)
    verification_level = models.CharField(max_length=20, choices=VERIFICATION_LEVEL_CHOICES)

    mandatory_for_all_applications = models.BooleanField(default=False)
    enable_agency_verification = models.BooleanField(default=False)
    flag_data_mismatch_automatically = models.BooleanField(default=False)
    flag_duplicate_pan_cards = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.agency_name} - {self.verification_type}"