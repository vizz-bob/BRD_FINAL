from django.db import models


class EscalationRule(models.Model):

    PROCESS_STAGE_CHOICES = (
        ('DOC_VERIFICATION', 'Document Verification'),        
        ('DISBURSEMENT', 'Disbursement'),
        ('UNDERWRITING', 'Underwriting'),
    )

    ACTION_CHOICES = (
        ('NOTIFY_SUPERVISOR', 'Notify Supervisor'),
        ('NOTIFY_ADMIN', 'Notify Admin'),
        ('AUTO_REASSIGN', 'Auto Reassign'),
    )

    process_stage = models.CharField(
        max_length=50,
        choices=PROCESS_STAGE_CHOICES
    )

    trigger_delay_hours = models.PositiveIntegerField(
        help_text="Delay in hours before escalation"
    )

    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "escalation_rules"
        ordering = ['-created_at']
        unique_together = (
            ('process_stage', 'action'),
        )

    def __str__(self):
        return f"{self.process_stage} → {self.action} ({self.trigger_delay_hours}h)"

