from rest_framework.permissions import BasePermission


class IsTenantAdmin(BasePermission):
    """
    Allows access only to Tenant Admin users
    """

    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and hasattr(user, "role_type")
            and user.role_type == "ADMIN"
        )


class IsTenantStaff(BasePermission):
    """
    Allows access to Tenant Staff users
    """

    def has_permission(self, request, view):
        user = request.user

        return (
            user
            and user.is_authenticated
            and hasattr(user, "role_type")
            and user.role_type in ["STAFF", "ADMIN"]
        )


class IsSameTenant(BasePermission):
    """
    Ensures user can only access their own tenant data
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        return (
            user
            and hasattr(user, "tenant_id")
            and str(obj.tenant_id) == str(user.tenant_id)
        )


class HasRolePermission(BasePermission):
    """
    Generic permission check based on role_id (permission group)
    """

    required_permission = None

    def has_permission(self, request, view):
        if not self.required_permission:
            return True

        user = request.user

        # This is a placeholder for permission-service integration
        return (
            user
            and user.is_authenticated
            and hasattr(user, "role_id")
        )
