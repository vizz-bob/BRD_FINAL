from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class LoanProduct(models.TextChoices):
    BUSINESS_LOAN = 'business_loan', 'Business Loan'
    PERSONAL_LOAN = 'personal_loan', 'Personal Loan'
    HOME_LOAN = 'home_loan', 'Home Loan'
    MSME_LOAN = 'msme_loan', 'MSME Loan'
    LAP = 'lap', 'Loan Against Property'


class LeadStage(models.TextChoices):
    NEW = 'new', 'New'
    CONTACTED = 'contacted', 'Contacted'
    QUALIFIED = 'qualified', 'Qualified'
    APPLICATION = 'application', 'Application'
    DOCS_PENDING = 'docs_pending', 'Docs Pending'
    APPROVED = 'approved', 'Approved'
    DISBURSED = 'disbursed', 'Disbursed'
    REJECTED = 'rejected', 'Rejected'


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('sales_executive', 'Sales Executive'),
        ('relationship_manager', 'Relationship Manager'),
        ('team_lead', 'Team Lead'),
        ('admin', 'Admin'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='team_member')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='sales_executive')
    phone = models.CharField(max_length=15, blank=True)
    city = models.CharField(max_length=100, blank=True)
    monthly_target = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.get_role_display()}"


class Lead(models.Model):
    borrower_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15)
    city_region = models.CharField(max_length=100, blank=True)
    loan_product = models.CharField(max_length=50, choices=LoanProduct.choices, default=LoanProduct.BUSINESS_LOAN)
    ticket_size = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    internal_remarks = models.TextField(blank=True)
    stage = models.CharField(max_length=30, choices=LeadStage.choices, default=LeadStage.NEW)
    assigned_to = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads'
    )
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='created_leads'
    )
    pan_document = models.FileField(upload_to='kyc/pan/', null=True, blank=True)
    aadhaar_document = models.FileField(upload_to='kyc/aadhaar/', null=True, blank=True)
    gst_document = models.FileField(upload_to='kyc/gst/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    applied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.borrower_name} - {self.get_stage_display()}"


class ReminderType(models.TextChoices):
    CALL = 'call', 'Call'
    EMAIL = 'email', 'Email'
    MEETING = 'meeting', 'Meeting'
    FOLLOW_UP = 'follow_up', 'Follow Up'
    DOCUMENT = 'document', 'Document Collection'


class Reminder(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='reminders', null=True, blank=True)
    title = models.CharField(max_length=255)
    due_date = models.DateTimeField()
    reminder_type = models.CharField(max_length=30, choices=ReminderType.choices, default=ReminderType.CALL)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_reminders')
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return f"{self.title} - {self.lead.borrower_name if self.lead else 'No Lead'}"


class Notification(models.Model):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    sent_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_notifications')
    recipients = models.ManyToManyField(User, related_name='received_notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification from {self.sent_by} at {self.created_at:%Y-%m-%d %H:%M}"



class Resource(models.Model):
    RESOURCE_TYPES = [
        ('pdf', 'PDF Document'),
        ('video', 'Video Tutorial'),
        ('docx', 'Word Document'),
        ('link', 'External Link'),
    ]
    
    CATEGORY_CHOICES = [
        ('Product Guides', 'Product Guides'),
        ('Training Materials', 'Training Materials'),
        ('Forms & Templates', 'Forms & Templates'),
        ('Support & Help', 'Support & Help'),
        ('Quick Links', 'Quick Links'),
    ]
    
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Product Guides')
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES)
    file = models.FileField(upload_to='resources/', null=True, blank=True)
    link = models.URLField(max_length=500, null=True, blank=True)
    summary = models.TextField(blank=True)
    size = models.CharField(max_length=50, blank=True)
    downloads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

