from rest_framework.permissions import BasePermission

class IsMasterAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "MASTER_ADMIN"
        )
