from django.db import models
import uuid

# ---------------------------
# LOAN CLASSIFICATION
# ---------------------------
class LoanClassification(models.Model):
    CLASSIFICATION_TYPE_CHOICES = (
        ("STANDARD", "Standard"),
        ("SUBSTANDARD", "Substandard"),
        ("NPA", "NPA"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    classification_name = models.CharField(max_length=100)
    classification_type = models.CharField(max_length=20, choices=CLASSIFICATION_TYPE_CHOICES)
    criteria_description = models.TextField(blank=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.classification_name


# ---------------------------
# WRITE-OFF RULES
# ---------------------------
class WriteOffRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    writeoff_policy = models.CharField(max_length=150)
    minimum_days_overdue = models.PositiveIntegerField()
    product_type = models.CharField(max_length=100)

    def __str__(self):
        return self.writeoff_policy


# ---------------------------
# SETTLEMENT RULES
# ---------------------------
class SettlementRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    settlement_policy_name = models.CharField(max_length=150)
    max_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    product_type = models.CharField(max_length=100)

    def __str__(self):
        return self.settlement_policy_name


# ---------------------------
# PROVISIONING & NPA
# ---------------------------
class ProvisioningNPA(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    classification_type = models.CharField(max_length=50)
    days_overdue = models.PositiveIntegerField()
    provision_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    product_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.classification_type} - {self.product_type}"


# ---------------------------
# INCENTIVE MANAGEMENT
# ---------------------------
class IncentiveManagement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product_type = models.CharField(max_length=100)
    incentive_rate = models.DecimalField(max_digits=5, decimal_places=2)
    condition = models.TextField(blank=True)

    def __str__(self):
        return self.product_type
