from django.db import models
import uuid


STATUS_CHOICES = (
    ("ACTIVE", "Active"),
    ("INACTIVE", "Inactive"),
)


class SubscriptionPlan(models.Model):
    """
    MASTER ADMIN: Subscription Master
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    subscription_name = models.CharField(max_length=100, unique=True)
    subscription_amount = models.DecimalField(max_digits=10, decimal_places=2)

    no_of_borrowers = models.PositiveIntegerField()
    no_of_users = models.PositiveIntegerField()

    subscription_type = models.CharField(
        max_length=20,
        choices=(("MONTHLY", "Monthly"), ("QUARTERLY", "Quarterly"), ("ANNUAL", "Annual"))
    )

    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.subscription_name


class Subscriber(models.Model):
    """
    MASTER ADMIN: Tenant ↔ Subscription mapping
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    tenant_id = models.UUIDField()
    subscription = models.ForeignKey(
        SubscriptionPlan, on_delete=models.PROTECT, related_name="subscribers"
    )

    subscription_start = models.DateTimeField()
    subscription_end = models.DateTimeField()

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ACTIVE")

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.tenant_id} - {self.subscription.subscription_name}"
