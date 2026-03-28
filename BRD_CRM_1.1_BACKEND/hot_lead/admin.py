from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Lead, Stage, HotLead

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


@admin.register(Lead)
class LeadAdmin(ImportExportModelAdmin):
    list_display = (
        "id",
        "name",
        "phone",
        "priority",
        "status",
        "score",
        "intent_percentage",
        "los_stage",
        "los_status",
        "created_at",
    )
    list_filter = ("priority", "status", "stage")
    search_fields = ("name", "phone")
    ordering = ("-created_at",)


@admin.register(HotLead)
class HotLeadAdmin(ImportExportModelAdmin):
    list_display = (
        "id",
        "lead",
        "tag_status",
        "updated_at",
    )
    list_filter = ("tag_status",)
    search_fields = ("lead__name", "lead__phone")





