from django.db import models
from django.utils import timezone
from bulk_upload.models import ManualEntry
#========================
#Raw lead module
#============================

LEAD_SOURCES = [
    ("csv", "CSV Upload"),
    ("api_justdial", "API - JustDial"),
    ("manual", "Manual Entry"),
    ("fb_campaign", "FB Campaign"),
]

VALIDATION_STATUS = [
    ("verified", "Verified"),
    ("duplicate", "Duplicate"),
    ("incomplete", "Incomplete"),
]

AGENT_CHOICES = [
    ("agent_a", "Agent A (Capacity: 120)"),
    ("agent_b", "Agent B (Capacity: 120)"),
    ("agent_c", "Agent C (Capacity: 120)"),
]

class RawLeadPool(models.Model):
    lead = models.ForeignKey(ManualEntry,on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()

    source = models.CharField(
        max_length=50,
        choices=LEAD_SOURCES
    )

    validation_status = models.CharField(
        max_length=50,
        choices=VALIDATION_STATUS,
        default="incomplete"
    )
    ingested_at = models.DateField(default=timezone.now)

    created_at = models.DateTimeField(auto_now_add=True)

    assigned_to = models.CharField(
        max_length=20,
        choices=AGENT_CHOICES,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.name} - {self.phone_number}"
#----------------------------
# Validation Config
#---------------------------
from django.db import models


class ValidationEngineConfiguration(models.Model):

    # =========================
    # NAME VALIDATION
    # =========================
    full_name = models.BooleanField(
        default=True,
        help_text="Reject leads missing a name"
    )

    # =========================
    # PHONE VALIDATION
    # =========================
    phone_number = models.BooleanField(
        default=True,
        help_text="Primary contact verification"
    )

    # =========================
    # EMAIL VALIDATION
    # =========================
    email_address= models.BooleanField(
        default=True,
        help_text="Electronic contact verification"
    )

    # =========================
    # DEDUPLICATION LOGIC
    # =========================
    mobile_dedupe = models.BooleanField(
        default=True,
        help_text="Check for existing phone numbers"
    )

    email_dedupe = models.BooleanField(
        default=True,
        help_text="Check for existing email addresses"
    )

    # =========================
    # REJECTION HANDLING
    # =========================
    rejection_note = models.TextField(
        blank=True,
        null=True,
        help_text="Leads failing these checks will move to Rejected Pool"
    )
    clean_raw_pool = models.BooleanField(
        default=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    LEAD_STAGE = [
        ("raw", "Raw Pool"),
        ("rejected", "Rejected Pool"),
        ("stage_2", "Stage 2"),
    ]

    stage = models.CharField(
        max_length=20,
        choices=LEAD_STAGE,
        default="raw"
    )
    def save(self, *args, **kwargs):

        config = ValidationEngineConfiguration.objects.first()

        if config:

            # Name check
            if config.full_name and not self.name:
                self.stage = "rejected"

            # Phone check
            if config.mobile_dedupe:
                if RawLeadPool.objects.filter(phone_number=self.phone_number).exclude(id=self.id).exists():
                    self.stage = "rejected"

            # Email check
            if config.email_dedupe:
                if RawLeadPool.objects.filter(email=self.email).exclude(id=self.id).exists():
                    self.stage = "rejected"

        super().save(*args, **kwargs)
    def __str__(self):
        return "Validation Engine Configuration"

#-----------------------------
#Data ingestion Dashboard
#------------------------------
from django.db import models
class DataIngestionDashboard(models.Model):
    total_raw_pool = models.IntegerField(default=0)
    validation_pass = models.FloatField(default=0.0)
    pending_assignment = models.IntegerField(default=0)
    suppressed_leads = models.IntegerField(default=0)
    
#--------------------------
#Suppression list
#---------------------------
from django.db import models

SUPPRESSION_REASONS = [
    ("consent_no", "Consent Marked No."),
    ("regulatory_block", "Regulatory Block"),
    ("manual_suppression", "Manual Suppression"),
]

class SuppressionList(models.Model):
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=20)
    email = models.EmailField()
    suppression_reason = models.CharField(max_length=50, choices=SUPPRESSION_REASONS)
    blocked_date = models.DateField()
    action_delete = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.suppression_reason}"
