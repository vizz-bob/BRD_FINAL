from django.db import models
from django.contrib.auth.models import User

class Incentive(models.Model):
    team_member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incentive_records')
    month = models.DateField()  # store as first day of month
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    disbursed_leads = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('team_member', 'month')

    def __str__(self):
        return f"{self.team_member.get_full_name()} - {self.month:%B %Y} - ₹{self.amount}"

class CommissionStatement(models.Model):
    STATUS_CHOICES = [
        ("PAID", "Paid"),
        ("PENDING", "Pending"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.IntegerField()
    year = models.IntegerField()

    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    disbursed_volume_bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    conversion_bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    speed_bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    team_bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")

    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "month", "year")

    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year}"