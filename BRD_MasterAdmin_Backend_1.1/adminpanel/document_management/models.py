from django.db import models
import uuid

STATUS_CHOICES = (
    ("Active", "Active"),
    ("Inactive", "Inactive"),
)

class SanctionDocument(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    document_type = models.CharField(max_length=150)
    requirement_type = models.CharField(max_length=100)
    requirement_stage = models.CharField(max_length=100)
    requirement_mode = models.CharField(max_length=100)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "sanction_documents"

class LoanDocument(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    document_type = models.CharField(max_length=150)
    requirement_type = models.CharField(max_length=100)
    requirement_stage = models.CharField(max_length=100)
    requirement_mode = models.CharField(max_length=100)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "loan_documents"

class CollateralDocument(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    collateral_category = models.CharField(max_length=100)
    collateral_type = models.CharField(max_length=100)
    security_coverage_type = models.CharField(max_length=100)
    mode_of_collateral = models.CharField(max_length=100)

    collateral_details = models.TextField()
    loan_to_collateral_value = models.DecimalField(max_digits=5, decimal_places=2)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "collateral_documents"
