from django.db import models
import uuid
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser

from adminpanel.models import Subscription

class Tenant(models.Model):
    tenant_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    tenant_type = models.CharField(max_length=50, choices=[('BANK','Bank'),('NBFC','NBFC'),('P2P','P2P'),('FINTECH','FinTech')])
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # subscription = models.ForeignKey(
    #     Subscription,
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    #     related_name="tenants"
    # )
    country = models.CharField(max_length=100, blank=True)

    cin = models.CharField(max_length=21, unique=True, null=True, blank=True)
    pan = models.CharField(max_length=10, unique=True, null=True, blank=True)
    gstin = models.CharField(max_length=15, unique=True, null=True, blank=True)

    users_count = models.PositiveIntegerField(null=True, blank=True)


    class Meta:
        db_table = 'tenants'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Branch(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='branches')
    branch_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'branches'
        verbose_name_plural = 'Branches'

    def __str__(self):
        return f"{self.name} ({self.tenant.name})"

# ---------------------- CALENDAR MODELS ----------------------

# calendar_config/models.py
from django.db import models
from django.utils.timezone import now

class FinancialYear(models.Model):
    name = models.CharField(max_length=50)
    start = models.DateField()
    end = models.DateField()

    is_active = models.BooleanField(default=False)

    created_by = models.CharField(max_length=100, blank=True, null=True)
    created_date = models.DateField(default=now)  # 👈 FIX

    class Meta:
        ordering = ['-start']
        verbose_name = "Financial Year"
        verbose_name_plural = "Financial Years"

    def __str__(self):
        return self.name


# class FinancialYear(models.Model):
#     tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="financial_years")
#     name = models.CharField(max_length=100)
#     start = models.DateField()
#     end = models.DateField()
#     is_active = models.BooleanField(default=True)

#     class Meta:
#         db_table = "calendar_financial_years"
#         ordering = ['-start']

#     def __str__(self):
#         return f"{self.name} ({self.tenant.name})"

class ReportingPeriod(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="reporting_periods")
    name = models.CharField(max_length=100)
    start = models.DateField()
    end = models.DateField()

    class Meta:
        db_table = "calendar_reporting_periods"

    def __str__(self):
        return f"{self.name}"

class Holiday(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="holidays")
    title = models.CharField(max_length=100)
    date = models.DateField()

    class Meta:
        db_table = "calendar_holidays"
        ordering = ['date']

    def __str__(self):
        return f"{self.title} - {self.date}"

# -----------------------------------------------------------
# NEW CATEGORY MODEL  (Types of Category - TOC)
# -----------------------------------------------------------

class Category(models.Model):
    CATEGORY_KEYS = [
        ("loan", "Loan Category"),
        ("product", "Product Category"),
        ("document", "Document Category"),
        ("lead", "Lead Category"),
        ("source", "Source Category"),
        ("customer", "Customer Category"),
        ("internal_team", "Internal Team Category"),
        ("external_team", "External Team Category"),
    ]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="categories")
    category_key = models.CharField(max_length=50, choices=CATEGORY_KEYS)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "categories"
        ordering = ("category_key", "title")

    def __str__(self):
        return f"{self.get_category_key_display()} - {self.title}"

# -----------------------------------------------------------
# TENANT RULE CONFIG (JSON Config for No-Code)
# -----------------------------------------------------------

class TenantRuleConfig(models.Model):
    tenant = models.OneToOneField(
        Tenant, on_delete=models.CASCADE, related_name="rule_config"
    )
    # This JSONField stores specific rules like:
    # { "personal_loan": { "min_cibil": 700, "negative_pincodes": ["110001"] } }
    config = models.JSONField(default=dict)

    def __str__(self):
        return f"Rules for {self.tenant.name}"

# =========================================================
# 1. PRICING MASTERS (Interest, Fees, Penalties)
# =========================================================

class InterestConfig(models.Model):
    INTEREST_TYPES = (('FIXED', 'Fixed Rate'), ('FLOATING', 'Floating Rate'))
    ACCRUAL_METHODS = (('SIMPLE', 'Simple'), ('COMPOUND', 'Compound'))
    ACCRUAL_STAGES = (('PRE_EMI', 'Pre-EMI'), ('POST_EMI', 'Post-EMI'))
    BENCHMARKS = (('REPO', 'RBI Repo Rate'), ('MCLR', 'Bank MCLR'), ('TBILL', 'T-Bill Rate'))

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='interest_configs')
    name = models.CharField(max_length=200)
    
    interest_type = models.CharField(max_length=20, choices=INTEREST_TYPES, default='FIXED')
    
    # For Fixed
    base_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Annual Rate %")
    
    # For Floating
    benchmark_type = models.CharField(max_length=20, choices=BENCHMARKS, null=True, blank=True)
    spread_margin = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, help_text="Mark Up")
    
    # Accrual Logic
    accrual_method = models.CharField(max_length=20, choices=ACCRUAL_METHODS, default='SIMPLE')
    accrual_stage = models.CharField(max_length=20, choices=ACCRUAL_STAGES, default='POST_EMI')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_interest_configs"

    def __str__(self): return f"{self.name} - {self.base_rate}%"

class ChargeConfig(models.Model):
    """Handles both Fees (Processing) and Penalties (Late Payment)"""
    CATEGORY_CHOICES = (('FEE', 'Fee'), ('PENALTY', 'Penalty'))
    
    FREQUENCY_CHOICES = (('ONE_TIME', 'One-time'), ('RECURRING', 'Recurring'))
    
    BASIS_CHOICES = (('FIXED', 'Fixed Amount'), ('PERCENTAGE', 'Percentage'), ('SLAB', 'Slab Based'))
    
    RECOVERY_STAGES = (
        ('DISBURSEMENT', 'Deduct from Disbursement'), 
        ('ONGOING', 'Ongoing'), 
        ('MISSED_EMI', 'Missed EMI'), 
        ('POST_DEFAULT', 'Post Default')
    )
    
    RECOVERY_MODES = (('AUTO', 'Auto (Next Bill)'), ('MANUAL', 'Manual Collection'))

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='charge_configs')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='FEE')
    
    # Configuration
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='ONE_TIME')
    basis = models.CharField(max_length=20, choices=BASIS_CHOICES, default='FIXED')
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Value or %")
    
    # For Penalties
    slab_config = models.JSONField(default=dict, blank=True, help_text="{'1-30 days': 2%, '31-60 days': 4%}")
    
    recovery_stage = models.CharField(max_length=50, choices=RECOVERY_STAGES, default='DISBURSEMENT')
    recovery_mode = models.CharField(max_length=20, choices=RECOVERY_MODES, default='AUTO')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_charge_configs"

    def __str__(self): return f"{self.name} ({self.category})"

# =========================================================
# 2. REPAYMENT RULES (Waterfall & Schedule)
# =========================================================

# Helper function defined outside the class to allow serialization by Django migrations
def default_waterfall():
    return ["Penalties", "Charges", "Fees", "Interest", "Principal"]

class RepaymentConfig(models.Model):
    SCHEDULE_TYPES = (('EMI', 'EMI'), ('BULLET', 'Bullet'), ('STEP_UP', 'Step-up'))
    FREQUENCIES = (('MONTHLY', 'Monthly'), ('BI_WEEKLY', 'Bi-weekly'), ('WEEKLY', 'Weekly'))

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='repayment_configs')
    name = models.CharField(max_length=200)
    
    schedule_type = models.CharField(max_length=50, choices=SCHEDULE_TYPES, default='EMI')
    frequency = models.CharField(max_length=50, choices=FREQUENCIES, default='MONTHLY')
    
    # Specific Dates
    cycle_date = models.IntegerField(default=5, help_text="Day of month (e.g., 5th)")
    
    # Waterfall Mechanism
    waterfall_sequence = models.JSONField(
        default=default_waterfall,  # Used the named function here
        help_text="Order of appropriation"
    )
    
    grace_days = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_repayment_configs"

    def __str__(self): return self.name

# =========================================================
# 3. RISK CRITERIA (Eligibility & Scorecards)
# =========================================================

class RiskRule(models.Model):
    """Eligibility Criteria"""
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='risk_rules')
    name = models.CharField(max_length=200)
    
    # Demographics
    min_age = models.IntegerField(default=21)
    max_age = models.IntegerField(default=60)
    allowed_income_types = models.JSONField(default=list, help_text="['Salaried', 'Self-Employed']")
    
    # Financials
    min_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    min_cash_flow = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    min_turnover = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_foir = models.DecimalField(max_digits=5, decimal_places=2, default=60.00, help_text="Max FOIR %")

    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "tenant_risk_rules"

    def __str__(self): return self.name

class ScoreCard(models.Model):
    """AI Engine Template"""
    TEMPLATE_TYPES = (('SALARIED', 'Employees'), ('PROFESSIONAL', 'Professionals'), ('BUSINESS', 'Business'))
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='scorecards')
    name = models.CharField(max_length=200)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_TYPES, default='SALARIED')
    
    # Detailed Rules stored as JSON
    # Structure: [ { "criterion": "CIBIL", "condition": ">750", "impact": "Positive", "weight": "High" }, ... ]
    rules_config = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_scorecards"

    def __str__(self): return f"{self.name} ({self.template_type})"

# =========================================================
# PRODUCT LINKING
# =========================================================

class TenantLoanProduct(models.Model):
    LOAN_TYPES = (
        ("Payday Loan (Short-term Loan)", "Payday Loan (Short-term Loan)"),
        ("Personal Loan (Unsecured)", "Personal Loan (Unsecured)"),
        ("Business Loan", "Business Loan"),
        ("Group Loan (JLG/SHG Model)", "Group Loan (JLG/SHG Model)"),
        ("Unsecured Education Loan", "Unsecured Education Loan"),
        ("Consumer Durable Loan", "Consumer Durable Loan"),
        ("Loan Against Property (LAP)", "Loan Against Property (LAP)"),
        ("Loan Against Shares/Securities", "Loan Against Shares/Securities"),
        ("Gold Loan", "Gold Loan"),
        ("Vehicle Loan", "Vehicle Loan"),
        ("Secured Education Loan", "Secured Education Loan"),
        ("Supply Chain Finance", "Supply Chain Finance"),
        ("Bill/Invoice Discounting", "Bill/Invoice Discounting"),
        ("Virtual Card (Buy Now, Pay Later)", "Virtual Card (Buy Now, Pay Later)"),
        ("Credit Line - OD Facility", "Credit Line - OD Facility"),
        ("Agriculture Loan", "Agriculture Loan"),
        ("Microfinance Loan", "Microfinance Loan"),
        ("Equipment Financing", "Equipment Financing"),
        ("Working Capital Loan", "Working Capital Loan"),
        ("Medical Emergency Loan", "Medical Emergency Loan"),
    )

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='loan_products')
    name = models.CharField(max_length=200)
    loan_type = models.CharField(max_length=100, choices=LOAN_TYPES)
    
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    min_tenure = models.IntegerField()
    max_tenure = models.IntegerField()

    # Linking Masters
    interest_config = models.ForeignKey(InterestConfig, on_delete=models.SET_NULL, null=True, blank=True)
    repayment_config = models.ForeignKey(RepaymentConfig, on_delete=models.SET_NULL, null=True, blank=True)
    risk_rule = models.ForeignKey(RiskRule, on_delete=models.SET_NULL, null=True, blank=True)
    scorecard = models.ForeignKey(ScoreCard, on_delete=models.SET_NULL, null=True, blank=True)
    charges = models.ManyToManyField(ChargeConfig, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_loan_products"

    def __str__(self): return self.name