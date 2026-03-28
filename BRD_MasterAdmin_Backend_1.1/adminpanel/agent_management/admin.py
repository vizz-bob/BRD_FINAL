from django.contrib import admin
from .models import *


@admin.register(ChannelPartner)
class ChannelPartnerAdmin(admin.ModelAdmin):
    list_display = ("agent_name", "agent_type", "status")
    list_filter = ("status",)


@admin.register(VerificationAgency)
class VerificationAgencyAdmin(admin.ModelAdmin):
    list_display = ("agent_name", "verification_agent_type", "status")
    list_filter = ("status",)


@admin.register(CollectionAgent)
class CollectionAgentAdmin(admin.ModelAdmin):
    list_display = ("agent_name", "recovery_type", "status")
    list_filter = ("status",)
