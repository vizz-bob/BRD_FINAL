from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import TeamMember

@receiver(post_save, sender=User)
def create_team_member(sender, instance, created, **kwargs):
    if created:
        TeamMember.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_team_member(sender, instance, **kwargs):
    if hasattr(instance, 'team_member'):
        instance.team_member.save()
