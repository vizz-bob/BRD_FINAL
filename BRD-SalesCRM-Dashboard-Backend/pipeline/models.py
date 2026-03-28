from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Lead(models.Model):

    STAGE_CHOICES = [
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('APPLICATION_SUBMITTED', 'Application Submitted'),
        ('APPROVED', 'Approved'),
        ('DISBURSED', 'Disbursed'),
    ]

    LOAN_TYPE_CHOICES = [
        ('HOME', 'Home Loan'),
        ('PERSONAL', 'Personal Loan'),
        ('BUSINESS', 'Business Loan'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)

    loan_type = models.CharField(max_length=50, choices=LOAN_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)

    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='NEW')

    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.stage}"

class CRMTool(models.Model):

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PASSIVE', 'Passive'),
        ('ON_DEMAND', 'On Demand'),
    ]

    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    sync_frequency = models.CharField(max_length=100, blank=True, null=True)
    last_synced_at = models.DateTimeField(blank=True, null=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name