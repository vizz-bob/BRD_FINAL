from django.contrib import admin
from .models import Role, Permission, RolePermission, UserRole
from .widgets import PermissionCheckboxWidget


# ================== INLINE CONFIG ==================
class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 1


class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 1


from django import forms

class RoleAdminForm(forms.ModelForm):
    # Rename to avoid conflicting with the reverse relationship `permissions`
    role_permissions = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.all(),
        # Lazy load the widget so we don't need to pass it incorrectly if it fails
        required=False,
        label="Permissions"
    )

    class Meta:
        model = Role
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Apply the custom widget
        self.fields['role_permissions'].widget = PermissionCheckboxWidget()
        
        if self.instance and self.instance.pk:
            # Pre-select existing permissions
            self.fields['role_permissions'].initial = Permission.objects.filter(
                rolepermission__role=self.instance
            )

    def save(self, commit=True):
        role = super().save(commit=False)
        if commit:
            role.save()
            self.save_m2m()  # Saves standard M2M required by Django
            self.save_role_permissions(role)
        return role

    def save_role_permissions(self, role):
        if 'role_permissions' in self.cleaned_data:
            selected_permissions = self.cleaned_data['role_permissions']
            print(f"DEBUG: Form save - selected_permissions type: {type(selected_permissions)}")
            print(f"DEBUG: Form save - selected_permissions count: {len(selected_permissions) if selected_permissions else 0}")
            print(f"DEBUG: Form save - selected_permissions: {[p.code for p in selected_permissions] if selected_permissions else []}")
            
            # Remove all existing permissions for this role
            existing_count = RolePermission.objects.filter(role=role).count()
            print(f"DEBUG: Removing {existing_count} existing permissions")
            RolePermission.objects.filter(role=role).delete()
            
            # Add newly selected permissions
            added_count = 0
            for perm in selected_permissions:
                rp, created = RolePermission.objects.get_or_create(role=role, permission=perm)
                if created:
                    added_count += 1
                    print(f"DEBUG: Added new permission: {perm.code}")
                else:
                    print(f"DEBUG: Permission already existed: {perm.code}")
            
            print(f"DEBUG: Total permissions after save: {RolePermission.objects.filter(role=role).count()}")
            print(f"DEBUG: Added {added_count} new permissions")
        else:
            print("DEBUG: 'role_permissions' not in cleaned_data")

# ================== ROLE ADMIN ==================
@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    form = RoleAdminForm
    list_display = ("name", "role_type", "status", "is_active", "created_at")
    list_filter = ("role_type", "status", "is_active")
    search_fields = ("name", "description")
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
@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "assigned_at")
