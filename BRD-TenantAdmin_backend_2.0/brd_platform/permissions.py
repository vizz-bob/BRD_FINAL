from rest_framework import permissions

class IsMasterAdmin(permissions.BasePermission):
    """
    Allow only users with role MASTER_ADMIN (or superuser) to access.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, 'role', None) == 'MASTER_ADMIN' or user.is_superuser

class IsTenantAdmin(permissions.BasePermission):
    """
    Allow only users who are tenant admins for their tenant.
    We assume role field contains 'ADMIN' or 'SUPER_ADMIN' etc.
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        # either explicit role
        if getattr(user, 'role', None) in ('ADMIN', 'SUPER_ADMIN'):
            return True
        return False
