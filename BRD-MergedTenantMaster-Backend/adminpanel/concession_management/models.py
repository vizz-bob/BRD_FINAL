from django.db import models
import uuid

STATUS_CHOICES = (
    ("Active", "Active"),
    ("Inactive", "Inactive"),
)

APPLICABLE_ON_CHOICES = (
    ("Sanction", "Sanction"),
    ("Disbursement", "Disbursement"),
    ("Repayment", "Repayment"),
)

class ConcessionType(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    concession_type_name = models.CharField(max_length=150)
    applicable_on = models.CharField(max_length=50, choices=APPLICABLE_ON_CHOICES)

    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "concession_type"

class ConcessionCategory(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    category_name = models.CharField(max_length=150)

    linked_concession_type = models.ForeignKey(
        ConcessionType,
        on_delete=models.PROTECT
    )

    product_type = models.CharField(max_length=100)

    valid_from = models.DateField()
    valid_to = models.DateField()

    eligibility_criteria = models.TextField()

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "concession_category"
