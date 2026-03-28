from rest_framework.permissions import BasePermission


class IsHomeDashboardAllowed(BasePermission):
    """
    RBAC for Home Dashboard
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = getattr(request.user, "role", None)

        if role in ["SUPER_ADMIN", "MASTER_ADMIN"]:
            return True

        if role == "ORG_ADMIN" and request.method == "GET":
            return True

        return False


class HasRBACPermission(BasePermission):
    """
    Generic RBAC permission checker
    """
    required_permission = None

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if not self.required_permission:
            return False

        return request.user.has_permission(self.required_permission)
    

class CanManageRoles(HasRBACPermission):
    required_permission = "role.manage"


class CanManagePermissions(HasRBACPermission):
    required_permission = "permission.manage"


class CanAssignRoles(HasRBACPermission):
    required_permission = "role.assign"

