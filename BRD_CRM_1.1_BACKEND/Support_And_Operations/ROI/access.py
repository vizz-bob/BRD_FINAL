# ROI/access.py

from rest_framework.permissions import BasePermission

class IsAdminOrMarketing(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_staff
