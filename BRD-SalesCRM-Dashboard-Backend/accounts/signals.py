from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import (
    UserProfile, NotificationPreference, GeneralSettings, 
    PrivacySettings, DataPrivacySettings
)

@receiver(post_save, sender=User)
def create_user_profiles(sender, instance, created, **kwargs):
    if created:
        # Create all associated profile objects automatically
        UserProfile.objects.get_or_create(user=instance)
        NotificationPreference.objects.get_or_create(user=instance)
        GeneralSettings.objects.get_or_create(user=instance)
        PrivacySettings.objects.get_or_create(user=instance)
        DataPrivacySettings.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profiles(sender, instance, **kwargs):
    # Ensure nested profile objects are saved if the user is saved
    if hasattr(instance, 'profile'):
        instance.profile.save()
    if hasattr(instance, 'notification_prefs'):
        instance.notification_prefs.save()
    if hasattr(instance, 'general_settings'):
        instance.general_settings.save()
    if hasattr(instance, 'privacy_settings'):
        instance.privacy_settings.save()
    if hasattr(instance, 'data_privacy_settings'):
        instance.data_privacy_settings.save()
