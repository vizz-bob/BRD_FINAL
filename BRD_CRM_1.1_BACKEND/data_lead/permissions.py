from rest_framework.permissions import BasePermission

class IsAdminOrSales(BasePermission):

    def has_permission(self, request, view):
        role = request.user.role  # assuming role field on User
        return role in ['Admin', 'Sales']

    def has_object_permission(self, request, view, obj):
        role = request.user.role

        if role == 'Admin':
            return True

        if role == 'Sales':
            return obj.assigned_to == request.user.username

        return False
