# system_settings/permissions.py
from rest_framework.permissions import BasePermission

class IsTenantAdmin(BasePermission):
    """
    Allows access only to users who are tenant admins.
    Assumes User model has 'is_tenant_admin' boolean field.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "is_tenant_admin", False))
