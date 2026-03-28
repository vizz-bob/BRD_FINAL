from django.contrib import admin
from .models import EmploymentTypeMaster

@admin.register(EmploymentTypeMaster)
class EmploymentTypeMasterAdmin(admin.ModelAdmin):
    list_display = ("emp_name", "isDeleted", "created_at")
    search_fields = ("emp_name",)
    list_filter = ("isDeleted",)
