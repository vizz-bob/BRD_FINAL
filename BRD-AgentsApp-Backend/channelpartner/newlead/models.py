from django.db import models

class ViewDetails(models.Model):
    """
    Stores details about when a user views a new lead (for audit/logging/analytics)
    """
    lead = models.ForeignKey('NewLeadRequest', on_delete=models.CASCADE, related_name='view_details')
    user = models.ForeignKey('channelpartner.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='viewed_newleads')
    viewed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-viewed_at']
        verbose_name = 'View Detail'
        verbose_name_plural = 'View Details'

    def __str__(self):
        return f"{self.lead.id} viewed by {self.user.username if self.user else 'Unknown'} at {self.viewed_at}"
from django.db import models
from django.conf import settings

class NewLeadRequest(models.Model):
    """
    New lead submission with personal and loan details
    """
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUBMITTED', 'Submitted'),
        ('REJECTED', 'Rejected'),
    )
    
    PRODUCT_TYPE_CHOICES = (
        ('BUSINESS_LOAN', 'Business Loan'),
        ('PERSONAL_LOAN', 'Personal Loan'),
        ('EDUCATIONAL_LOAN', 'Educational Loan'),
        ('HOME_LOAN', 'Home Loan'),
        ('CAR_LOAN', 'Car Loan'),
    )
    
    # Personal Details
    full_name = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=15)
    email = models.EmailField(null=True, blank=True)
    pan_number = models.CharField(max_length=10, null=True, blank=True)
    aadhar_number = models.CharField(max_length=12, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    
    # Loan Details
    product_type = models.CharField(max_length=50, choices=PRODUCT_TYPE_CHOICES)
    loan_amount_required = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Additional Fields
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='newlead_requests', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} - {self.product_type}"

class LeadScan(models.Model):
    """
    Log of OCR scans for audit and debugging
    """
    SCAN_TYPES = (
        ('PAN', 'PAN Card'),
        ('AADHAAR', 'Aadhaar Card'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lead_scans')
    lead = models.ForeignKey('channelpartner.Lead', on_delete=models.SET_NULL, null=True, blank=True, related_name='scans')
    scan_type = models.CharField(max_length=10, choices=SCAN_TYPES)
    image = models.ImageField(upload_to='scans/%Y/%m/%d/', null=True, blank=True)
    raw_text = models.TextField(null=True, blank=True)
    extracted_data = models.JSONField(null=True, blank=True)
    success = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.get_scan_type_display()} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class LeadRequirement(models.Model):
    """
    Document requirements for different loan products
    """
    product_type = models.CharField(max_length=50, unique=True)
    required_documents = models.JSONField(help_text="e.g. ['PAN', 'Aadhaar', '3 Months Bank Statement']")
    minimum_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    instructions = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.product_type

class LeadConsent(models.Model):
    """
    Disclaimer and consent text for the lead creation form
    """
    title = models.CharField(max_length=100, default="Lead Verification & Approval")
    content = models.TextField()
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


# ......................

