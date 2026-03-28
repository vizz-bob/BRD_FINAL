from django.db import models
from django.conf import settings
from django.utils import timezone

class ProfileSettings(models.Model):
    user = models.OneToOneField('channelpartner.User', on_delete=models.CASCADE, related_name='settings')
    
    # Notification Preferences
    push_notifications = models.BooleanField(default=True)
    email_alerts = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    
    # Privacy Settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('PUBLIC', 'Public'),
            ('PRIVATE', 'Private'),
            ('CONTACTS_ONLY', 'Contacts Only')
        ],
        default='PRIVATE'
    )
    show_phone = models.BooleanField(default=False, help_text="Show phone number on profile")
    show_email = models.BooleanField(default=False, help_text="Show email on profile")
    allow_contact_requests = models.BooleanField(default=True)
    allow_lead_sharing = models.BooleanField(default=False)
    
    # Security Settings
    two_factor_enabled = models.BooleanField(default=False)
    login_alerts = models.BooleanField(default=True, help_text="Alert on new login")
    suspicious_activity_alerts = models.BooleanField(default=True)
    change_password_required = models.BooleanField(default=False)
    last_password_change = models.DateTimeField(null=True, blank=True)
    session_timeout_minutes = models.IntegerField(default=30)
    require_ip_verification = models.BooleanField(default=False)
    blocked_ips = models.JSONField(default=list, blank=True, help_text="List of blocked IP addresses")
    
    # Optional: Other preferences
    dark_mode = models.BooleanField(default=False)
    language = models.CharField(max_length=10, default='en')
    
    # Timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Settings for {self.user.username}"
    
    class Meta:
        verbose_name = "Profile Settings"
        verbose_name_plural = "Profile Settings"

class UserDocument(models.Model):
    DOCUMENT_TYPES = (
        ('IDENTITY', 'Identity Proof'),
        ('ADDRESS', 'Address Proof'),
        ('QUALIFICATION', 'Qualification'),
        ('OTHER', 'Other'),
    )
    
    user = models.ForeignKey('channelpartner.User', on_delete=models.CASCADE, related_name='profile_documents')
    doc_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='user_docs/')
    verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.doc_type}"


class PrivacyPolicy(models.Model):
    """
    Privacy & Security Policy with detailed sections
    """
    title = models.CharField(max_length=200, default="Your Privacy Matters - Important Notice")
    introduction = models.TextField(help_text="Opening statement about privacy importance")
    
    # 10 Main Sections
    information_we_collect = models.TextField(help_text="Section 1: Information we collect")
    how_we_use_information = models.TextField(help_text="Section 2: How we use your information")
    information_sharing = models.TextField(help_text="Section 3: Information sharing")
    data_security = models.TextField(help_text="Section 4: Data security")
    your_rights_and_choices = models.TextField(help_text="Section 5: Your rights and choices")
    data_retention = models.TextField(help_text="Section 6: Data retention")
    cookies_and_tracking = models.TextField(help_text="Section 7: Cookies and tracking")
    third_party_services = models.TextField(help_text="Section 8: Third party services")
    childrens_privacy = models.TextField(help_text="Section 9: Children's privacy")
    changes_to_policy = models.TextField(help_text="Section 10: Changes to privacy policy")
    contact_us = models.TextField(help_text="Contact information for privacy inquiries")
    
    # Quick Summary
    quick_summary = models.TextField(help_text="Brief summary of the privacy policy")
    
    # Status
    is_active = models.BooleanField(default=True)
    version = models.CharField(max_length=10, default="1.0")
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Privacy Policy"
        verbose_name_plural = "Privacy Policies"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - v{self.version}"


# Lead model (single, complete definition below)

class SupportTicket(models.Model):
    """
    Support ticket for customers to raise issues
    """
    CATEGORY_CHOICES = (
        ('ACCOUNT', 'Account Issues'),
        ('LEAD', 'Lead Related'),
        ('TECHNICAL', 'Technical Issues'),
        ('PAYMENT', 'Payment Issues'),
        ('DOCUMENTATION', 'Documentation'),
        ('OTHER', 'Other'),
    )
    
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
    )
    
    ticket_id = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    issue_description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    
    # Support Details
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )
    response_notes = models.TextField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.ticket_id:
            from django.utils import timezone
            year = timezone.now().year
            last_ticket = SupportTicket.objects.filter(ticket_id__startswith=f'TK-{year}').order_by('-ticket_id').first()
            if last_ticket:
                last_num = int(last_ticket.ticket_id.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            self.ticket_id = f'TK-{year}-{new_num:04d}'
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.ticket_id} - {self.category}"


class SupportContactInfo(models.Model):
    """
    Support contact information and actions
    """
    phone_number = models.CharField(max_length=15, default="+91-XXXX-XXXX-XX")
    whatsapp_number = models.CharField(max_length=15, default="+91-XXXX-XXXX-XX")
    email = models.EmailField(default="support@example.com")
    support_hours = models.CharField(max_length=100, default="Mon-Fri, 9 AM - 6 PM IST")
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Support Contact Info"
        verbose_name_plural = "Support Contact Info"
    
    def __str__(self):
        return "Support Contact Information"


class Lead_Profile(models.Model):
    full_name = models.CharField(max_length=150)
    mobile_number = models.CharField(max_length=10)
    email = models.EmailField(blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)

    # --- Personal details ---
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
