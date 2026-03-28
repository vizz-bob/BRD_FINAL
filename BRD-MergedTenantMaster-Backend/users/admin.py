from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'role', 'phone', 'tenant', 'is_active', 'created_at')
    list_filter = ('role', 'tenant', 'is_active')
    search_fields = ('email', 'phone')
    ordering = ('-created_at',)

    fieldsets = (
        ('Auth', {'fields': ('email', 'password')}),
        ('Personal Details', {'fields': ('phone',)}),
        ('Organization', {'fields': ('tenant', 'branch', 'role', 'employee_id', 'approval_limit')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role')
        }),
    )

    readonly_fields = ('created_at', 'updated_at')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'tenant', 'role', 'created_at')
    list_filter = ('tenant', 'role')
    search_fields = ('user__email',)
    readonly_fields = ('created_at',)
