from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "updated_at",
    )

    list_filter = ("status",)
    search_fields = ("id", "status")
