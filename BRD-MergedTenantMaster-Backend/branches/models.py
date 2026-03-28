import uuid
from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.validators import RegexValidator

from businesses.models import Business
from product.models import Product


class Branch(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ---------------------------
    # Relations
    # ---------------------------
    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="branches",
        blank=True,
        null=True
    )

    allowed_products = models.ManyToManyField(
        Product,
        related_name="branches",
        blank=True
    )

    # ---------------------------
    # Branch Info
    # ---------------------------
    branch_name = models.CharField(max_length=150)

    gstin = models.CharField(
        max_length=15,
        blank=True,
        null=True
    )

    contact_person = models.CharField(max_length=100)

    mobile_no = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^[6-9]\d{9}$',
                message="Enter a valid Indian mobile number"
            )
        ]
    )

    email = models.EmailField()

    address = models.TextField()

    # ---------------------------
    # Authentication
    # ---------------------------
    branch_password = models.CharField(max_length=128)

    # ---------------------------
    # Status & Audit
    # ---------------------------
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='ACTIVE'
    )

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_branches"
        ordering = ["-created_at"]
        unique_together = ("business", "email")

    def save(self, *args, **kwargs):
        if self.branch_password and not self.branch_password.startswith('pbkdf2_'):
            self.branch_password = make_password(self.branch_password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.branch_name} ({self.business.business_name})"
