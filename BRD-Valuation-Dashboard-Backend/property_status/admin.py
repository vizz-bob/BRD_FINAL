#--------------------------------
# Property status pending
#---------------------------------
from django.contrib import admin
from .models import PropertyPending
@admin.register(PropertyPending)
class PropertyPendingAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "property_id",
        "type",
        "location",
        "assigned_to",
        "status",
        "priority",
        "last_check",
        "close",
    )
    list_filter = (
        "status",
        "priority",
        "structure_integrity",
        "property_dimensions",
        "legal_documentation",
        "utilities_assessment",
        "close",
    )
    search_fields = ("property_id", "location", "assigned_to")
#-------------------------
# In progress
#-------------------------
from django.contrib import admin
from .models import PropertyInProgress


@admin.register(PropertyInProgress)
class PropertyInProgressAdmin(admin.ModelAdmin):

    list_display = (
        "property_id",
        "name",
        "type",
        "location",
        "assigned_to",
        "status",
        "priority",
        "last_check",
        "close",
    )

    list_filter = (
        "status",
        "priority",
        "infrastructure_check",
        "safety_compliance",
        "building_permits",
        "environmental_assessment",
        "close",
    )
    search_fields = ("property_id", "name", "location", "assigned_to")
#---------------------------------
# Property status Completed
#---------------------------------
from django.contrib import admin
from .models import PropertyCompleted


@admin.register(PropertyCompleted)
class PropertyCompletedAdmin(admin.ModelAdmin):

    list_display = (
        "property_id",
        "name",
        "type",
        "location",
        "assigned_to",
        "status",
        "priority",
        "last_check",
        "close",
    )

    list_filter = (
        "priority",
        "machinery_inspection",
        "storage_facilities",
        "waste_management",
        "worker_safety_measures",
        "close",
    )

    search_fields = ("property_id", "name", "location", "assigned_to")
#-----------------------------
# status and search
#----------------------------
from django.contrib import admin
from .models import StatusSearch


@admin.register(StatusSearch)
class StatusSearchAdmin(admin.ModelAdmin):
    list_display = ("search", "status")
    list_filter = ("status",)
    search_fields = ("search",)