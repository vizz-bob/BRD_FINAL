from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class DashboardLead(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('ACTIVE', 'Active'),
        ('CONVERTED', 'Converted'),
    )

    name = models.CharField(max_length=100)
    loan_type = models.CharField(max_length=100)
    amount = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class DashboardPayout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.amount)