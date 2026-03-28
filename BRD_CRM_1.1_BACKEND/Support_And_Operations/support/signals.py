from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Ticket

@receiver(post_save, sender=Ticket)
def ticket_created_handler(sender, instance, created, **kwargs):
    if created:
        # yaha SLA ya notifications handle kar sakte ho
        print(f"New ticket created: {instance.title}")
