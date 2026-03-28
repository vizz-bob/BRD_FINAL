from django.db import models
from django.utils import timezone


# -------------------------
# Stage Model
# -------------------------
class Stage(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# -------------------------
# Lead Model (Main CRM Lead)
# -------------------------
class Lead(models.Model):

    PRIORITY_CHOICES = (
        ("HIGH", "High"),
        ("MEDIUM", "Medium"),
        ("LOW", "Low"),
    )

    STATUS_CHOICES = (
        ("NEW", "New"),
        ("FOLLOW_UP", "Follow Up"),
        ("MEETING", "Meeting Scheduled"),
        ("QUALIFIED", "Qualified"),
        ("DEAL", "Converted to Deal"),
        ("DORMANT", "Dormant"),
    )

    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20, blank=True, null=True)
    lead_source = models.CharField(max_length=100, blank=True, null=True)

    score = models.IntegerField(default=0)
    intent_percentage = models.IntegerField(default=0)
    docs_completed = models.BooleanField(default=False)

    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name="leads")

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default="MEDIUM"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="NEW"
    )

    # LOS Profile Fields
    los_stage = models.CharField(max_length=50, default="Stage 4")
    los_description = models.TextField(default="Verified via KYC & Income Documents")
    los_status = models.CharField(max_length=50, default="Pre-Approved")


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    sla_days = models.IntegerField(default=2)

    def is_sla_breach(self):
        days_passed = (timezone.now() - self.created_at).days
        return days_passed > self.sla_days

    def __str__(self):
        return self.name


# -------------------------
# HotLead Model (Special Tag)
# -------------------------
class HotLead(models.Model):

    HOT_STATUS_CHOICES = (
        ("All","All"),
        ("HOT", "Hot Lead"),
        ("SLA_BREACH", "SLA Breach"),
        ("DOCS_PENDING", "Documents Pending"),
        ("AVG_INTENT", "Average Intent"),
    )

    lead = models.OneToOneField(
        Lead,
        on_delete=models.CASCADE,
        related_name="hot_lead"
    )

    tag_status = models.CharField(
        max_length=20,
        choices=HOT_STATUS_CHOICES,
        default="HOT"
    )

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.lead.name} - {self.tag_status}"


class IntentActivity(models.Model):

    ACTIVITY_CHOICES = (
        ("WHATSAPP_CLICK", "WhatsApp Link Clicked"),
        ("EXPLICIT_REQUEST", "Explicit Request"),
        ("VIEWED_DOC", "Viewed Loan Terms"),
    )

    lead = models.ForeignKey(
        HotLead,
        related_name="activities",
        on_delete=models.CASCADE
    )

    activity_type = models.CharField(
        max_length=50,
        choices=ACTIVITY_CHOICES
    )

    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead.lead.name} - {self.activity_type}"
