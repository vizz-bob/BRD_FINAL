from django.db import models


class LeadStatus(models.TextChoices):
    DOC_VERIFICATION = "DOC_VERIFICATION", "Doc Verification"
    FOLLOW_UP = "FOLLOW_UP", "Follow Up"
    READY_FOR_CONSULT = "READY_FOR_CONSULT", "Ready for Consult"
    MEETING_SCHEDULED = "MEETING_SCHEDULED", "Meeting Scheduled"
    SLA_BREACH = "SLA_BREACH", "SLA Breach"
    CONVERTED = "CONVERTED", "Converted to Deal"
    DORMANT = "DORMANT", "Dormant"


class Lead(models.Model):
    pipeline_lead = models.OneToOneField(
        "pipeline.PipelineLead",
        on_delete=models.CASCADE,
        related_name="conversion",
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=30,
        choices=LeadStatus.choices,
        default=LeadStatus.DOC_VERIFICATION
    )

    score = models.PositiveIntegerField(default=0)
    
    # LOS Profile fields
    los_stage = models.CharField(max_length=50, null=True, blank=True)
    los_status = models.CharField(max_length=50, default="Pending")
    los_description = models.TextField(null=True, blank=True)
    
    # Metadata
    vendor_source = models.CharField(max_length=100, null=True, blank=True)
    docs_status = models.CharField(max_length=20, default="Pending")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_sla_breach(self):
        # 2 days SLA
        from django.utils import timezone
        return (timezone.now() - self.created_at).days >= 2

    def __str__(self):
        return f"Conversion Lead {self.id} → {self.status}"


class IntentActivity(models.Model):
    ACTIVITY_CHOICES = (
        ("WHATSAPP_CLICK", "WhatsApp Link Clicked"),
        ("EXPLICIT_REQUEST", "Explicit Request"),
        ("VIEWED_DOC", "Viewed Loan Terms"),
    )

    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name="activities"
    )

    activity_type = models.CharField(max_length=50, choices=ACTIVITY_CHOICES)
    note = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead.id} - {self.activity_type}"
