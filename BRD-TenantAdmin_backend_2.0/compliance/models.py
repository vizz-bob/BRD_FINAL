# compliance/models.py
from django.db import models
from tenants.models import Tenant
import uuid


class ComplianceCheck(models.Model):
    CHECK_TYPE_CHOICES = [
        ('KYC', 'KYC Verification'),
        ('AML', 'Anti Money Laundering'),
        ('CREDIT', 'Credit Bureau Check'),
        ('RISK', 'Risk Assessment'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='compliance_checks')
    check_type = models.CharField(max_length=50, choices=CHECK_TYPE_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "compliance_checks"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.check_type} - {self.status}"


class RiskFlag(models.Model):
    SEVERITY_CHOICES = [
        ('LOW', 'Low Risk'),
        ('MEDIUM', 'Medium Risk'),
        ('HIGH', 'High Risk'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='risk_flags')
    title = models.CharField(max_length=200)
    details = models.TextField(blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    related_check = models.ForeignKey(
        ComplianceCheck,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='risk_flags'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "risk_flags"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.severity})"
