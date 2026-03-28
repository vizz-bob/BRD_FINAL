from django.contrib import admin
from .models import VendorProfile, AgentProfile, ClientProfile


@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ("vendor_type", "vendor_category", "vendor_location", "is_active")
    search_fields = ("vendor_type", "vendor_category", "vendor_service_type")


@admin.register(AgentProfile)
class AgentProfileAdmin(admin.ModelAdmin):
    list_display = ("agent_type", "agent_category", "agent_location", "is_active")
    search_fields = ("agent_type", "agent_category", "agent_service_type")


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ("client_category", "client_type", "employment_type", "is_active")
    search_fields = ("client_category", "client_type", "occupation")
