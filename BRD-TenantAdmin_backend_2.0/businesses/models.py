import uuid
from django.db import models
from django.core.validators import RegexValidator


import uuid
from django.db import models
from django.core.validators import RegexValidator
from product.models import Product


class Business(models.Model):
    BUSINESS_STATUS = (
        ("active", "Active"),
        ("inactive", "Inactive"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ---------------------------
    # Identity & Registration
    # ---------------------------
    business_name = models.CharField(max_length=255)

    pan_number = models.CharField(
        max_length=10,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{5}[0-9]{4}[A-Z]$',
                message="Invalid PAN format"
            )
        ]
    )

    cin = models.CharField(
        max_length=21,
        blank=True,
        null=True,
        unique=True
    )

    gstin = models.CharField(
        max_length=15,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$',
                message="Invalid GSTIN format"
            )
        ]
    )

    # ---------------------------
    # Address
    # ---------------------------
    registered_address = models.TextField()

    # ---------------------------
    # Loan Products (RELATIONAL)
    # ---------------------------
    mapped_products = models.ManyToManyField(
        Product,
        related_name="businesses",
        blank=True
    )

    # ---------------------------
    # Status & Audit
    # ---------------------------
    status = models.CharField(
        max_length=10,
        choices=BUSINESS_STATUS,
        default="active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "business_master"
        ordering = ["-created_at"]

    def __str__(self):
        return self.business_name
