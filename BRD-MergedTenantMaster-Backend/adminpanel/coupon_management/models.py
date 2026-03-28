from django.db import models
import uuid
from adminpanel.subscription_management.models import SubscriptionPlan


STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)

COUPON_USAGE_STATUS = (
    ("UNUSED", "Unused"),
    ("USED", "Used"),
    ("EXPIRED", "Expired"),
)


class Coupon(models.Model):
    """
    MASTER ADMIN: Coupon Master
    (Strictly as per SS)
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    promotion_name = models.CharField(max_length=100)
    no_of_coupons = models.PositiveIntegerField()

    coupon_value = models.DecimalField(max_digits=10, decimal_places=2)
    coupon_code = models.CharField(max_length=50, unique=True)

    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()

    usage_status = models.CharField(
        max_length=10, choices=COUPON_USAGE_STATUS, default="UNUSED"
    )

    subscriptions = models.ManyToManyField(
        SubscriptionPlan, blank=True, related_name="coupons"
    )

    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="ACTIVE"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.coupon_code
