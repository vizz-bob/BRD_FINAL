from django.contrib import admin
from .models import (
    UserProfile, NotificationPreference, Availability,
    Territory, Integration, GeneralSettings, PrivacySettings,
    DataPrivacySettings
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'phone', 'timezone', 'language']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    list_filter = ['role', 'timezone']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'email', 'sms', 'push', 'whatsapp', 'desktop']
    search_fields = ['user__username']


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ['user', 'day', 'active', 'from_time', 'to_time']
    list_filter = ['day', 'active']


@admin.register(Territory)
class TerritoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'pincode', 'assigned_to', 'lead_count']
    search_fields = ['name', 'pincode']
    raw_id_fields = ['assigned_to']


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'integration_type', 'status', 'last_sync']
    list_filter = ['integration_type', 'status']
    search_fields = ['name', 'user__username']


@admin.register(GeneralSettings)
class GeneralSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'date_format', 'currency', 'auto_save', 'items_per_page']


@admin.register(PrivacySettings)
class PrivacySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'share_analytics_data', 'marketing_communications']


@admin.register(DataPrivacySettings)
class DataPrivacySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'export_leads', 'export_reports', 'leads_last_exported_at', 'reports_last_exported_at', 'updated_at']
    list_filter = ['export_leads', 'export_reports']
    search_fields = ['user__username']
