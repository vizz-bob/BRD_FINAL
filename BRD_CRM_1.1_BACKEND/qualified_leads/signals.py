from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import QualifiedLead, Eligibility

@receiver(post_save, sender=QualifiedLead)
def create_eligibility(sender, instance, created, **kwargs):
    if created:
        # Check if eligibility already exists to avoid redundant creation
        if not hasattr(instance, "eligibility"):
            Eligibility.objects.get_or_create(lead=instance)
            print(f"Eligibility object created for Qualified Lead: {instance}")
    else:
        print(f"Qualified Lead updated: {instance}")
