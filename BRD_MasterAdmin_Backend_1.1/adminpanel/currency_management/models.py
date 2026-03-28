from django.db import models
import uuid

STATUS_CHOICES = (
    ("Active", "Active"),
    ("Inactive", "Inactive"),
)

class Currency(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    currency_code = models.CharField(max_length=10)          # INR, USD, EUR
    currency_symbol = models.CharField(max_length=10)        # ₹, $, €
    conversion_value_to_inr = models.DecimalField(
        max_digits=15,
        decimal_places=6
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Active"
    )

    created_user = models.CharField(max_length=100)
    modified_user = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    isDeleted = models.BooleanField(default=False)

    class Meta:
        db_table = "currency_management"
        unique_together = ("currency_code", "isDeleted")

    def __str__(self):
        return self.currency_code
