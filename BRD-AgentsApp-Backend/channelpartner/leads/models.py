from django.db import models

# ...existing code...

class LeadViewDetails(models.Model):
    """
    Stores details about when a user views a lead (for audit/logging/analytics)
    """
    lead = models.ForeignKey('Lead', on_delete=models.CASCADE, related_name='view_details')
    user = models.ForeignKey('channelpartner.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='viewed_leads')
    viewed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-viewed_at']
        verbose_name = 'View Detail'
        verbose_name_plural = 'View Details'

    def __str__(self):
        return f"{self.lead.lead_id} viewed by {self.user.username if self.user else 'Unknown'} at {self.viewed_at}"
from django.db import models
from channelpartner.accounts.models import User

class Lead(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SANCTIONED', 'Sanctioned'),
        ('DISBURSED', 'Disbursed'),
        ('REJECTED', 'Rejected'),
    )
    
    PRODUCT_TYPE_CHOICES = (
        ('BUSINESS_LOAN', 'Business Loan'),
        ('PERSONAL_LOAN', 'Personal Loan'),
        ('EDUCATIONAL_LOAN', 'Educational Loan'),
        ('HOME_LOAN', 'Home Loan'),
        ('CAR_LOAN', 'Car Loan'),
    )
    
    lead_id = models.CharField(max_length=20, unique=True, editable=False)
    partner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='partner_leads')
    credit_ops = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='creditops_leads')
    
    # Personal Details
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    
    # Documents
    pan = models.CharField(max_length=10, null=True, blank=True)
    aadhaar = models.CharField(max_length=12, null=True, blank=True)
    pan_image = models.ImageField(upload_to='documents/pan/', null=True, blank=True)
    aadhaar_image = models.ImageField(upload_to='documents/aadhaar/', null=True, blank=True)
    
    # Loan Details
    product_type = models.CharField(max_length=50, choices=PRODUCT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['lead_id']),
            models.Index(fields=['status']),
            models.Index(fields=['partner']),
            models.Index(fields=['credit_ops']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.lead_id:
            from django.utils import timezone
            year = timezone.now().year
            last_lead = Lead.objects.filter(lead_id__startswith=f'LD-{year}').order_by('-lead_id').first()
            if last_lead:
                last_num = int(last_lead.lead_id.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.lead_id = f'LD-{year}-{new_num:03d}'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.lead_id} - {self.name}"
class SanctionedLead(models.Model):
    lead = models.OneToOneField('Lead', on_delete=models.CASCADE, related_name='sanction')

    sanctioned_amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.FloatField()
    tenure_months = models.IntegerField()

    sanctioned_date = models.DateTimeField(auto_now_add=True)

    approved_by = models.ForeignKey(
        'channelpartner.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Sanctioned - {self.lead}"


class LeadQuery(models.Model):
    """
    Active Queries/Comments on leads for communication between Credit Ops and Partners
    """
    QUERY_STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('RESOLVED', 'Resolved'),
        ('PENDING', 'Pending'),
    )
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='queries')
    raised_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='raised_queries')
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=QUERY_STATUS_CHOICES, default='OPEN')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Lead Queries'
    
    def __str__(self):
        return f"{self.lead.lead_id} - {self.title}"


class LeadDocument(models.Model):
    """
    Additional documents uploaded for a lead
    """
    DOCUMENT_TYPE_CHOICES = (
        ('BANK_STATEMENT', 'Bank Statement'),
        ('SALARY_SLIP', 'Salary Slip'),
        ('ITR', 'Income Tax Return'),
        ('PROPERTY_DOCUMENT', 'Property Document'),
        ('OTHER', 'Other'),
    )
    
    VERIFICATION_STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('VERIFIED', 'Verified'),
        ('QUERY', 'Query Raised'),
        ('REJECTED', 'Rejected'),
    )
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='documents')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    document_file = models.FileField(upload_to='documents/additional/')
    description = models.TextField(null=True, blank=True)
    
    # Verification
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='PENDING')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_documents')
    verification_notes = models.TextField(null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.lead.lead_id} - {self.get_document_type_display()}"


class LeadActivity(models.Model):
    """
    Track all activities on a lead for audit trail
    """
    ACTIVITY_TYPE_CHOICES = (
        ('CREATED', 'Lead Created'),
        ('ASSIGNED', 'Assigned to Credit Ops'),
        ('STATUS_CHANGED', 'Status Changed'),
        ('QUERY_RAISED', 'Query Raised'),
        ('QUERY_RESOLVED', 'Query Resolved'),
        ('DOCUMENT_UPLOADED', 'Document Uploaded'),
        ('COMMENT_ADDED', 'Comment Added'),
        ('PAYOUT_CREATED', 'Payout Created'),
    )
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPE_CHOICES)
    description = models.TextField()
    metadata = models.JSONField(null=True, blank=True)  # Store additional data
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Lead Activities'
    
    def __str__(self):
        return f"{self.lead.lead_id} - {self.get_activity_type_display()}"


class LeadComment(models.Model):
    """
    Comments/Notes on leads
    """
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal notes not visible to partner
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.lead.lead_id} - Comment by {self.user.username}"


class Customer(models.Model):
    """
    Detailed information about the customer associated with a lead
    """
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='customer_info')
    pan = models.CharField(max_length=20)
    aadhaar = models.CharField(max_length=20)
    address = models.TextField()
    
    # Additional fields can be added here
    
    def __str__(self):
        return f"Customer for {self.lead.lead_id}"


class LeadStatusHistory(models.Model):
    """
    Tracks the history of status transitions for a lead
    """
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='status_history')
    stage = models.CharField(max_length=50) # e.g. 'Application', 'Credit Ops', 'Sanction'
    status = models.CharField(max_length=20, default='pending')
    notes = models.TextField(null=True, blank=True)
    
    updated_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['updated_at']
    
    def __str__(self):
        return f"{self.lead.lead_id} - {self.stage}: {self.status}"
