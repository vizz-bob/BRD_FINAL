from django.contrib import admin
from .models import Lead, Customer, LeadActivity


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "status", "tenant", "assigned_to")
    search_fields = ("name", "email", "phone")


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "tenant", "kyc_status")
    search_fields = ("name", "email", "phone")


@admin.register(LeadActivity)
class LeadActivityAdmin(admin.ModelAdmin):
    list_display = ("lead", "user", "created_at")
