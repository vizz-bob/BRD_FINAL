from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone", "status", "tenant", "created_at")
    search_fields = ("full_name", "phone", "email")
    list_filter = ("status",)
