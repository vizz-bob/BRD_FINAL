# los/models.py
import uuid
from django.db import models
from django.conf import settings

class LoanApplication(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('SUBMITTED', 'Submitted'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('DISBURSED', 'Disbursed'),
        ('CLOSED', 'Closed'),
    ]

    application_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE)
    branch = models.ForeignKey('tenants.Branch', on_delete=models.SET_NULL, null=True, blank=True)
    customer = models.ForeignKey('crm.Customer', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    tenure_months = models.IntegerField()
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='NEW')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='applications')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'loan_applications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.application_id} - {self.customer} - {self.status}"


class KYCDetail(models.Model):
    KYC_TYPES = (
        ('AADHAAR', 'Aadhaar'),
        ('PAN', 'PAN'),
        ('VOTER_ID', 'Voter ID'),
        ('PASSPORT', 'Passport'),
    )

    loan_application = models.ForeignKey(LoanApplication, on_delete=models.CASCADE, related_name='kyc_details')
    kyc_type = models.CharField(max_length=20, choices=KYC_TYPES)
    document_number = models.CharField(max_length=200)
    document_file = models.FileField(upload_to='kyc/%Y/%m/%d/', null=True, blank=True)
    status = models.CharField(max_length=20, default='PENDING')  # PENDING, VERIFIED, REJECTED
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'kyc_details'
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.loan_application.application_id} - {self.kyc_type}"


class CreditAssessment(models.Model):
    application = models.OneToOneField(LoanApplication, on_delete=models.CASCADE, related_name='credit_assessment')
    score = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='UNDER_REVIEW')  # UNDER_REVIEW, APPROVED, REJECTED
    approved_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    assessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'credit_assessments'
        ordering = ['-assessed_at']

    def __str__(self):
        return f"{self.application.application_id} - Score: {self.score}"
