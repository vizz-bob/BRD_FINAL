# los/permissions.py
from rest_framework import permissions

class IsTenantMember(permissions.BasePermission):
    """
    Allow access only to users that belong to the same tenant as the object.
    This expects models to have a .tenant foreign key (LoanApplication.tenant etc.)
    """

    def has_object_permission(self, request, view, obj):
        try:
            obj_tenant = getattr(obj, 'tenant', None)
            user_tenant = getattr(request.user, 'tenant', None)
            # superusers allowed
            if request.user and request.user.is_superuser:
                return True
            return obj_tenant is not None and user_tenant is not None and obj_tenant == user_tenant
        except Exception:
            return False
