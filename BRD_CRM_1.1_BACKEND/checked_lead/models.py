# checked_lead/models.py
from django.db import models
from pipeline.models import Lead
from django.contrib.auth import get_user_model

User = get_user_model()

class CheckedLead(models.Model):
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE, related_name='checked_lead')
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    lead_source = models.CharField(max_length=255, blank=True, null=True)
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        lead_name = getattr(self.lead, 'name', 'Unknown Lead')
        return f"{lead_name}"
