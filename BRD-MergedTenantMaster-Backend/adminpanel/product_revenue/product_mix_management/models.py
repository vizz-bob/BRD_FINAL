from django.db import models
import uuid
from adminpanel.product_revenue.product_management.models import Product


class ProductMix(models.Model):
    """
    Product Mix Management
    ----------------------
    Creates bundled product offerings by combining multiple base products.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    product_category = models.CharField(max_length=100)
    product_type = models.CharField(max_length=100)

    product_mix_name = models.CharField(
        max_length=150,
        unique=True,
        help_text="Unique name for product mix"
    )

    product_mix_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        help_text="Combined price / amount of product mix"
    )

    product_period_value = models.PositiveIntegerField(
        help_text="Duration value of product mix"
    )

    PRODUCT_PERIOD_UNIT_CHOICES = (
        ("DAYS", "Days"),
        ("MONTHS", "Months"),
        ("YEARS", "Years"),
    )
    product_period_unit = models.CharField(
        max_length=10,
        choices=PRODUCT_PERIOD_UNIT_CHOICES
    )

    products = models.ManyToManyField(
        Product,
        related_name="product_mixes",
        help_text="Base products included in this mix"
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_mixes"
        ordering = ["-created_at"]

    def __str__(self):
        return self.product_mix_name
