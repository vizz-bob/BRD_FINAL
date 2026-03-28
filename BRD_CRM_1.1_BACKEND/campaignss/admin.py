from django.contrib import admin
from .models import (
    DialerCampaign,
    DialerDashboard,
    SMSDashboard,
    VoicebroadcastDashboard,
    WhatsappDashboard,
    socialmediadashboard,
    EmailDashboard,
    EmailCampaign,
    SmsCampaign,
    WhatsAppCampaign,
    VoiceBroadcastCampaign,
    SocialMediaCampaign,
)


# =========================================================
# DIALER CAMPAIGN
# =========================================================

@admin.register(DialerCampaign)
class DialerCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "campaign_title",
        "product",
        "dialer_type",
        "timing",
        "status",
        "created_at",
    )
    list_filter = ("product", "dialer_type", "timing", "status")
    search_fields = ("campaign_title",)
    readonly_fields = ("created_at", "updated_at")


# =========================================================
# DIALER DASHBOARD
# =========================================================

@admin.register(DialerDashboard)
class DialerDashboardAdmin(admin.ModelAdmin):
    pass
@admin.register(EmailDashboard)
class EmailDashboardAdmin(admin.ModelAdmin):
    pass
@admin.register(SMSDashboard)
class SMSDashboardAdmin(admin.ModelAdmin):
    pass
@admin.register(WhatsappDashboard)
class WhatsappDashboardAdmin(admin.ModelAdmin):
    pass
@admin.register(VoicebroadcastDashboard)
class VoicebroadcastDashboardAdmin(admin.ModelAdmin):
    pass
@admin.register(socialmediadashboard)
class socialmediadashboardAdmin(admin.ModelAdmin):
    pass
# =========================================================
# EMAIL CAMPAIGN
# =========================================================

@admin.register(EmailCampaign)
class EmailCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "campaign_title",
        "product",
        "timing",
        "frequency",
        "status",
        "created_at",
    )
    list_filter = ("product", "timing", "frequency", "status")
    search_fields = ("campaign_title", "subject_line")
    readonly_fields = ("created_at", "updated_at")


# =========================================================
# SMS CAMPAIGN
# =========================================================

@admin.register(SmsCampaign)
class SmsCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "campaign_title",
        "product",
        "timing",
        "status",
        "created_at",
    )
    list_filter = ("product", "timing", "status")
    search_fields = ("campaign_title", "sender_id")
    readonly_fields = ("created_at", "updated_at")


# =========================================================
# WHATSAPP CAMPAIGN
# =========================================================

@admin.register(WhatsAppCampaign)
class WhatsAppCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "campaign_title",
        "product",
        "timing",
        "frequency",
        "status",
        "created_at",
    )
    list_filter = ("product", "timing", "frequency", "status")
    search_fields = ("campaign_title",)
    readonly_fields = ("created_at", "updated_at")


# =========================================================
# VOICE BROADCAST CAMPAIGN
# =========================================================

@admin.register(VoiceBroadcastCampaign)
class VoiceBroadcastCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "campaign_title",
        "product",
        "voice_source",
        "retry_attempts",
        "status",
        "created_at",
    )
    list_filter = ("product", "voice_source", "retry_attempts", "status")
    search_fields = ("campaign_title",)
    readonly_fields = ("created_at", "updated_at")


# =========================================================
# SOCIAL MEDIA CAMPAIGN
# =========================================================

@admin.register(SocialMediaCampaign)
class SocialMediaCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "campaign_title",
        "product",
        "frequency",
        "timing",
        "approver",
        "status",
        "created_at",
    )
    list_filter = ("product", "frequency", "timing", "approver", "status")
    search_fields = ("campaign_title",)
    readonly_fields = ("created_at", "updated_at")

