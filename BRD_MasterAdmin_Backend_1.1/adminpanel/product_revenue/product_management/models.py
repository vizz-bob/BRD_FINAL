from django.db import models
import uuid


class Product(models.Model):
    """
    Product Management
    ------------------
    Defines the core details of financial products being offered.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    product_category = models.CharField(
        max_length=100,
        help_text="Broad classification (e.g., Loan, Credit)"
    )

    product_type = models.CharField(
        max_length=100,
        help_text="Sub-category or variant (e.g., Personal Loan, Home Loan)"
    )

    product_name = models.CharField(
        max_length=150,
        unique=True,
        help_text="Name of the specific product"
    )

    product_period_value = models.PositiveIntegerField(
        help_text="Tenure value"
    )

    PRODUCT_PERIOD_UNIT_CHOICES = (
        ("DAYS", "Days"),
        ("MONTHS", "Months"),
        ("YEARS", "Years"),
    )
    product_period_unit = models.CharField(
        max_length=10,
        choices=PRODUCT_PERIOD_UNIT_CHOICES,
        help_text="Tenure unit"
    )

    product_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        help_text="Loan amount or service value"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "products"
        ordering = ["-created_at"]

    def __str__(self):
        return self.product_name
