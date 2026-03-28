# checked_lead/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from pipeline.models import Lead
from .models import hot_lead

@receiver(post_save, sender=Lead)
def create_hot_lead(sender, instance, created, **kwargs):
    if created:
        hot_lead.objects.create(lead=instance)
