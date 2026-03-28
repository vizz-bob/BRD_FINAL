from django.contrib import admin
from .models import AdminUser


@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "phone_number",
        "role",
        "approval_limit",
        "is_active",
    )

    list_filter = ("role",  "is_active")
    search_fields = ("user__email", "phone_number", "employee_id")
