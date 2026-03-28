from django.contrib import admin
from .models import (
    InternalDashboard,
    InternalPermission,
    InternalRole,
    InternalUserRole,
)


# ----------------------------
# Internal Dashboard
# ----------------------------
@admin.register(InternalDashboard)
class InternalDashboardAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "is_active")
    search_fields = ("name", "code")
    list_filter = ("is_active",)
    ordering = ("name",)


# ----------------------------
# Internal Permission
# ----------------------------
@admin.register(InternalPermission)
class InternalPermissionAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "dashboard")
    search_fields = ("name", "code")
    list_filter = ("dashboard",)
    ordering = ("dashboard__name", "name")


# ----------------------------
# Internal Role
# ----------------------------
@admin.register(InternalRole)
class InternalRoleAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    search_fields = ("name",)
    list_filter = ("is_active",)
    filter_horizontal = ("dashboards", "permissions")
    ordering = ("name",)


# ----------------------------
# User ↔ Role Mapping
# ----------------------------
@admin.register(InternalUserRole)
class InternalUserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role")
    search_fields = ("user__username", "role__name")
    list_filter = ("role",)
