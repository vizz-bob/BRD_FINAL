from django.db import models
from tenants.models import Tenant
from crm.models import Customer


CHANNEL_CHOICES = [
    ('SMS', 'SMS'),
    ('EMAIL', 'Email'),
    ('WHATSAPP', 'WhatsApp'),
]


class Communication(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)

    to = models.CharField(max_length=100)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()

    status = models.CharField(max_length=30, default='PENDING')  # PENDING, SENT, FAILED
    provider_message_id = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'communications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.channel} -> {self.to} ({self.status})"
