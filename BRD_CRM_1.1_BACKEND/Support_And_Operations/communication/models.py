from django.db import models
from django.contrib.auth.models import User

COMM_TYPE_CHOICES = (
    ('internal', 'Internal'),
    ('external', 'External'),
)

MODE_CHOICES = (
    ('chat', 'Chat'),
    ('email', 'Email'),
    ('call', 'Call'),
    ('whatsapp', 'WhatsApp'),
    ('meet', 'Meet'),
    ('slack', 'Slack'),
)

STATUS_CHOICES = (
    ('sent', 'Sent'),
    ('failed', 'Failed'),
    ('read', 'Read'),
    ('not_read', 'Not Read'),
    ('replied', 'Replied'),
)

DIRECTION_CHOICES = (
    ('inbound', 'Inbound'),
    ('outbound', 'Outbound'),
)

class Communication(models.Model):
    conversation_type = models.CharField(max_length=20, choices=COMM_TYPE_CHOICES)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES)

    lead_id = models.CharField(max_length=50, blank=True, null=True)
    deal_id = models.CharField(max_length=50, blank=True, null=True)

    subject = models.CharField(max_length=255, blank=True, null=True)
    message_content = models.TextField()

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='communications'
    )

    timestamp = models.DateTimeField(auto_now_add=True)
    scheduled_at = models.DateTimeField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sent')
    direction = models.CharField(max_length=20, choices=DIRECTION_CHOICES, default='outbound')

    def __str__(self):
        return f"{self.mode} - {self.subject or self.message_content[:20]}"


class CommunicationAttachment(models.Model):
    communication = models.ForeignKey(
        Communication,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    file = models.FileField(upload_to='communication_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for Communication #{self.communication.id}"
