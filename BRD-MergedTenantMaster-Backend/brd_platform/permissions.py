from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsMasterAdmin(BasePermission):
    """
    Allows access only to users in MASTER_ADMIN group
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Superusers should always pass master-admin checks.
        if user.is_superuser:
            return True

        return user.groups.filter(name__in=["Master Admin", "MASTER_ADMIN"]).exists()

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
        if getattr(user, 'role', None) in ('ADMIN', 'SUPER_ADMIN', 'Master Admin'):
            return True
        return False

class IsAdminOrMaster(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        if user.is_superuser:
            return True

        return user.groups.filter(
            name__in=["Master Admin", "MASTER_ADMIN", "Admin", "ADMIN"]
        ).exists()

class CanManageTenants(BasePermission):

    def has_permission(self, request, view):
        return request.user.has_perm("tenants.add_tenant")

class IsMasterAdminWithPermission(BasePermission):

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated and
            user.groups.filter(name="MASTER_ADMIN").exists() and
            user.has_perm("tenants.add_tenant")
        )
