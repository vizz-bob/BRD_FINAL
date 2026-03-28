from django.contrib import admin
from .models import (
    PredefinedTemplate,
    CustomisedTemplate,
    FieldMaster,
)

# ==========================
# PREDEFINED TEMPLATE ADMIN
# ==========================
@admin.register(PredefinedTemplate)
class PredefinedTemplateAdmin(admin.ModelAdmin):
    list_display = ("template_name", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("template_name",)


# ==========================
# FIELD MASTER ADMIN
# ==========================
@admin.register(FieldMaster)
class FieldMasterAdmin(admin.ModelAdmin):
    list_display = ("field_name", "field_key")
    search_fields = ("field_name", "field_key")


# ==========================
# CUSTOMISED TEMPLATE ADMIN
# ==========================
@admin.register(CustomisedTemplate)
class CustomisedTemplateAdmin(admin.ModelAdmin):
    list_display = (
        "template_name",
        "template_type",
        "is_mandatory",
        "is_active",
        "created_at",
    )
    list_filter = ("template_type", "is_mandatory", "is_active")
    search_fields = ("template_name",)
    filter_horizontal = ("field_masters",)
