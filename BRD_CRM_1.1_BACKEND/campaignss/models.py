import uuid
from django.db import models
from django.core.exceptions import ValidationError
from multiselectfield import MultiSelectField

from .constants import (
    PRODUCT_CHOICES,
    DIALER_TYPES,
    TIMING_CHOICES,
    EMAIL_TEMPLATES,
    SMS_TEMPLATES,
    VOICE_SOURCE_CHOICES,
)

# =====================================================
# COMMON CHOICES
# =====================================================

RETRY_ATTEMPTS = [(i, f"{i} Attempt{'s' if i > 1 else ''}") for i in range(1, 6)]

CAMPAIGN_STATUS_CHOICES = [
    ("draft", "Draft"),
    ("scheduled", "Scheduled"),
    ("active", "Active"),
    ("completed", "Completed"),
]

FREQUENCY_CHOICES = [
    ("once", "One-time"),
    ("daily", "Daily"),
    ("weekly", "Weekly"),
    ("monthly", "Monthly"),
]

TARGET_AUDIENCE_CHOICES = [
    ("warm_leads", "Warm Leads"),
    ("cold_leads", "Cold Leads"),
    ("hot_leads", "Hot Leads"),
    ("home_loan", "Home Loan Prospects"),
    ("business_owners", "Business Owners"),
    ("recent_inquiries", "Recent Inquiries"),
]

AGENT_ASSIGNMENT_CHOICES = [
    ("team_alpha", "Team Alpha"),
    ("team_beta", "Team Beta"),
    ("external_agency", "External Agency"),
]
class DialerDashboard(models.Model):
    
    active_campaigns = models.IntegerField(default=0)
    total_calls = models.IntegerField(default=0)
    Avg_Connect_Rate = models.IntegerField(default=0)
    engaged_leads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class EmailDashboard(models.Model):
    
    active_campaigns = models.IntegerField(default=0)
    total_sent = models.IntegerField(default=0)
    Avg_open_Rate = models.IntegerField(default=0)
    engaged_leads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class SMSDashboard(models.Model):
    
    active_SMS_campaigns = models.IntegerField(default=0)
    message_sent_today = models.IntegerField(default=0)
    Avg_Click_Rate = models.IntegerField(default=0)
    active_subscribers = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class WhatsappDashboard(models.Model):
    
    active_campaigns = models.IntegerField(default=0)
    total_sent = models.IntegerField(default=0)
    Avg_read_Rate = models.IntegerField(default=0)
    engaged_leads = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class VoicebroadcastDashboard(models.Model):
    
    active_broadcast = models.IntegerField(default=0)
    total_calls_made = models.IntegerField(default=0)
    Avg_Answer_Rate = models.IntegerField(default=0)
    keypad_reasponses = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class socialmediadashboard(models.Model):
    
    active_campaigns = models.IntegerField(default=0)
    total_impressions = models.IntegerField(default=0)
    engagement_Rate = models.IntegerField(default=0)
    click_through_rate = models.IntegerField(default=0)
    leads_generated = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# =====================================================
# DIALER CAMPAIGN
# =====================================================

class DialerCampaign(models.Model):
    campaign_title = models.CharField(max_length=255)
    product = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default="draft")

    target_audience = MultiSelectField(choices=TARGET_AUDIENCE_CHOICES, max_length=255, blank=True)

    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    dialer_type = models.CharField(max_length=50, choices=DIALER_TYPES)

    retry_attempts = models.IntegerField(choices=RETRY_ATTEMPTS, default=1)

    agent_assignment = MultiSelectField(choices=AGENT_ASSIGNMENT_CHOICES, max_length=255, blank=True)

    call_script = models.FileField(upload_to="call_scripts/", blank=True, null=True)

    timing = models.CharField(max_length=20, choices=TIMING_CHOICES, default="now")
    schedule_datetime = models.DateTimeField(blank=True, null=True)

    auto_schedule_followups = models.BooleanField(default=False)
    followup_retry_hours = models.PositiveIntegerField(default=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.campaign_title


# =====================================================
# EMAIL CAMPAIGN
# =====================================================

class EmailCampaign(models.Model):
    campaign_title = models.CharField(max_length=255)
    product = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default="draft")

    target_audience = MultiSelectField(choices=TARGET_AUDIENCE_CHOICES, max_length=255, blank=True)

    email_template = models.CharField(max_length=100, choices=EMAIL_TEMPLATES, default="default")
    subject_line = models.CharField(max_length=150)
    preview_text = models.CharField(max_length=200, blank=True, null=True)

    sender_email = models.EmailField()
    sender_name = models.CharField(max_length=100, blank=True, null=True)

    attachment = models.FileField(upload_to="email_attachments/", blank=True, null=True)

    timing = models.CharField(max_length=20, choices=TIMING_CHOICES, default="now")
    schedule_datetime = models.DateTimeField(blank=True, null=True)

    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="once")

    email_open_tracking = models.BooleanField(default=False)
    utm_parameters = models.BooleanField(default=False)
    click_tracking = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.campaign_title


# =====================================================
# SMS CAMPAIGN
# =====================================================

class SmsCampaign(models.Model):
    campaign_title = models.CharField(max_length=255)
    product = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default="draft")

    target_audience = MultiSelectField(choices=TARGET_AUDIENCE_CHOICES, max_length=255, blank=True)

    sms_template = models.CharField(max_length=50, choices=SMS_TEMPLATES, blank=True, null=True)
    sender_id = models.CharField(max_length=50)
    message_content = models.TextField()

    timing = models.CharField(max_length=20, choices=TIMING_CHOICES, default="now")
    schedule_datetime = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.campaign_title


# =====================================================
# WHATSAPP CAMPAIGN
# =====================================================

class WhatsAppCampaign(models.Model):
    campaign_title = models.CharField(max_length=255)
    product = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default="draft")

    target_audience = models.CharField(max_length=50, choices=TARGET_AUDIENCE_CHOICES)

    message_body = models.TextField()

    timing = models.CharField(max_length=20, choices=TIMING_CHOICES)
    schedule_datetime = models.DateTimeField(blank=True, null=True)

    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="once")

    enable_read_receipts_tracking = models.BooleanField(default=False)
    track_interactive_buttons = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.campaign_title


# =====================================================
# VOICE BROADCAST CAMPAIGN
# =====================================================

class VoiceBroadcastCampaign(models.Model):
    campaign_title = models.CharField(max_length=255)
    product = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default="draft")

    target_audience = MultiSelectField(choices=TARGET_AUDIENCE_CHOICES, max_length=255, blank=True)

    voice_source = models.CharField(max_length=20, choices=VOICE_SOURCE_CHOICES, blank=True, null=True)
    audio_file = models.FileField(upload_to="voice_campaigns/", blank=True, null=True)

    retry_attempts = models.IntegerField(choices=RETRY_ATTEMPTS, default=1)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.voice_source == "file" and not self.audio_file:
            raise ValidationError("Audio file is required when voice source is 'file'.")

    def __str__(self):
        return self.campaign_title


# =====================================================
# SOCIAL MEDIA CAMPAIGN
# =====================================================

class SocialMediaCampaign(models.Model):
    PLATFORM_SELECTION = [
        ("facebook", "Facebook"),
        ("instagram", "Instagram"),
        ("linkedin", "LinkedIn"),
        ("twitter", "Twitter"),
        ("youtube", "YouTube"),
    ]

    APPROVER_CHOICES = [
        ("manager_a", "Manager A"),
        ("manager_b", "Manager B"),
        ("marketing_head", "Marketing Head"),
        ("ceo", "CEO"),
    ]

    campaign_title = models.CharField(max_length=255)
    product = models.CharField(max_length=50, choices=PRODUCT_CHOICES)
    status = models.CharField(max_length=20, choices=CAMPAIGN_STATUS_CHOICES, default="draft")

    message_text = models.TextField(blank=True, null=True)
    post_url = models.URLField(blank=True, null=True)

    hashtags = models.TextField(blank=True)

    timing = models.CharField(max_length=20, choices=TIMING_CHOICES, default="now")
    schedule_datetime = models.DateTimeField(blank=True, null=True)

    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="once")

    approver = models.CharField(max_length=20, choices=APPROVER_CHOICES, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_hashtag_list(self):
        return [tag.strip() for tag in self.hashtags.split(",")] if self.hashtags else []

    def __str__(self):
        return self.campaign_title
