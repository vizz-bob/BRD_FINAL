from django.contrib import admin
from .models import Role, Permission, RolePermission, UserRole


# ================== INLINE CONFIG ==================
class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 1


class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 1


# ================== ROLE ADMIN ==================
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    search_fields = ("name",)
    readonly_fields = ("created_at",)
    inlines = [
        RolePermissionInline,
        UserRoleInline,
    ]


# ================== PERMISSION ADMIN ==================
@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ("code", "created_at")
    search_fields = ("code",)
    readonly_fields = ("created_at",)


# ================== OPTIONAL (DEBUG / VIEW) ==================
@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ("role", "permission")


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "assigned_at")
