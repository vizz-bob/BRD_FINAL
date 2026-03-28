from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_lead_name",
        "get_lead_phone",
        "status",
        "score",
        "updated_at",
    )

    list_filter = ("status",)
    search_fields = (
        "pipeline_lead__lead__name",
        "pipeline_lead__lead__phone",
    )

    ordering = ("-updated_at",)
    readonly_fields = ("updated_at",)

    def get_lead_name(self, obj):
        try:
            return obj.pipeline_lead.lead.name
        except AttributeError:
            return "Unknown"
    get_lead_name.short_description = "Lead Name"

    def get_lead_phone(self, obj):
        try:
            return obj.pipeline_lead.lead.phone
        except AttributeError:
            return "N/A"
    get_lead_phone.short_description = "Phone"
