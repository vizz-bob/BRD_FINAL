# checked_lead/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from pipeline.models import Lead
from .models import CheckedLead

@receiver(post_save, sender=Lead)
def create_checked_lead(sender, instance, created, **kwargs):
    if created:
        CheckedLead.objects.create(lead=instance)
