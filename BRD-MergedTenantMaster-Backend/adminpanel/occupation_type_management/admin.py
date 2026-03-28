from django.contrib import admin
from .models import OccupationTypeMaster

@admin.register(OccupationTypeMaster)
class OccupationTypeMasterAdmin(admin.ModelAdmin):
    list_display = ("occ_name", "isDeleted", "created_at")
    search_fields = ("occ_name",)
    list_filter = ("isDeleted",)
