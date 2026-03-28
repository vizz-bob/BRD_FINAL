# lms/permissions.py
from rest_framework import permissions

class IsTenantMember(permissions.BasePermission):
    """
    Simple permission: object must belong to same tenant as request.user. Superusers allowed.
    """

    def has_object_permission(self, request, view, obj):
        try:
            # many lms objects relate through loan_application -> tenant
            tenant = None
            if hasattr(obj, 'loan_application'):
                tenant = getattr(obj.loan_application, 'tenant', None)
            elif hasattr(obj, 'tenant'):
                tenant = getattr(obj, 'tenant', None)
            user_tenant = getattr(request.user, 'tenant', None)
            if request.user and request.user.is_superuser:
                return True
            return tenant is not None and user_tenant is not None and tenant == user_tenant
        except Exception:
            return False
