# subscriptions/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField(
        help_text="Plan validity in days (e.g. 30, 90, 365)"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "subscription_plan"

    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class UserSubscription(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions"
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT
    )

    purchase_date = models.DateTimeField(auto_now_add=True)
    activation_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    no_of_borrowers = models.PositiveIntegerField(default=0)
    no_of_users = models.PositiveIntegerField(default=1)

    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "user_subscription"

    def save(self, *args, **kwargs):
        if not self.activation_date:
            self.activation_date = timezone.now()

        if not self.end_date:
            self.end_date = self.activation_date + timedelta(days=self.plan.duration_days)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} - {self.plan.name}"
