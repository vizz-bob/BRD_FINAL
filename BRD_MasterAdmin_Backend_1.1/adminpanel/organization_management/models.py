from django.db import models
import uuid


# =========================
# ORGANIZATION
# =========================
class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    business_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    contact_person = models.CharField(max_length=150)

    gst_number = models.CharField(max_length=20, blank=True, null=True)
    pan_number = models.CharField(max_length=20, blank=True, null=True)
    cin_number = models.CharField(max_length=30, blank=True, null=True)

    full_address = models.TextField()
    loan_products = models.TextField(help_text="Comma separated loan products")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.business_name


# =========================
# BRANCH
# =========================
class Branch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="branches"
    )

    tenant_id = models.CharField(max_length=100)
    branch_code = models.CharField(max_length=50)
    branch_name = models.CharField(max_length=150)
    branch_address = models.TextField()

    contact_person = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("organization", "branch_code")

    def __str__(self):
        return f"{self.branch_name} ({self.branch_code})"
