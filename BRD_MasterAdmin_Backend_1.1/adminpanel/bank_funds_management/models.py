from django.db import models
import uuid

STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)

# -------------------------
# 1. Bank Management
# -------------------------
class Bank(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    bank_name = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=20)
    branch = models.CharField(max_length=100)

    bank_account_type = models.CharField(
        max_length=50
    )  # Savings, Current, NODAL, Escrow

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.bank_name


# -------------------------
# 2. Fund Management
# -------------------------
class FundType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    fund_type = models.CharField(
        max_length=50
    )  # Internal Fund, Borrowed Fund, Corpus Fund

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.fund_type


class Fund(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    fund_type = models.CharField(
        max_length=100
    )

    fund_source = models.CharField(
        max_length=100
    )

    available_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2
    )

    fund_allocation_logic = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)


# -------------------------
# 3. Portfolio Management
# -------------------------
class Portfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    portfolio_name = models.CharField(max_length=100)

    portfolio_type = models.CharField(
        max_length=50
    )  # Retail, MSME, Housing

    banks = models.ManyToManyField(
        Bank,
        related_name="portfolios"
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.portfolio_name


# -------------------------
# 4. Mode of Bank
# -------------------------
MODE_TYPE_CHOICES = (
    ("RECEIPT", "Receipt"),
    ("PAYMENT", "Payment"),
)


class ModeOfBank(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    mode_type = models.CharField(
        max_length=10,
        choices=MODE_TYPE_CHOICES
    )

    mode_name = models.CharField(
        max_length=50
    )  # NEFT, RTGS, ECS, NACH, etc.

    is_default = models.BooleanField(default=False)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)


# -------------------------
# 5. Taxation Management
# -------------------------
class Tax(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tax_type = models.CharField(
        max_length=50
    )  # GST, TDS

    tax_category = models.CharField(
        max_length=50
    )  # Processing Fee, Interest

    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    valid_from = models.DateField()
    valid_to = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)


# -------------------------
# 6. Business Model
# -------------------------
class BusinessModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    model_type = models.CharField(
        max_length=50
    )  # Mark-up, Payout, Lease, Co-Lending

    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)
