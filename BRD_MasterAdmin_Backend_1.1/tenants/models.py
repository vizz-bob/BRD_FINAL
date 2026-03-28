from django.db import models
import uuid
from django.utils.text import slugify

from adminpanel.models import Subscription

class Tenant(models.Model):
    tenant_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=200, unique=True)
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
    subscription = models.ForeignKey(
        Subscription,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="tenants"
    )

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


class FinancialYear(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="financial_years")
    name = models.CharField(max_length=100)
    start = models.DateField()
    end = models.DateField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "calendar_financial_years"
        ordering = ['-start']

    def _str_(self):
        return f"{self.name} ({self.tenant.name})"


class ReportingPeriod(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="reporting_periods")
    name = models.CharField(max_length=100)
    start = models.DateField()
    end = models.DateField()

    class Meta:
        db_table = "calendar_reporting_periods"

    def _str_(self):
        return f"{self.name}"


class Holiday(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="holidays")
    title = models.CharField(max_length=100)
    date = models.DateField()

    class Meta:
        db_table = "calendar_holidays"
        ordering = ['date']

    def _str_(self):
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

    def _str_(self):
        return f"{self.get_category_key_display()} - {self.title}"
    

class TenantRuleConfig(models.Model):
    tenant = models.OneToOneField(
        Tenant, on_delete=models.CASCADE, related_name="rule_config"
    )
    config = models.JSONField(default=dict)

    def __str__(self):
        return f"Rules for {self.tenant.name}"    