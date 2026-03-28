from rest_framework.permissions import BasePermission

class IsFieldAgent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'field_agent'
        )
# class IsCollectionAgent(BasePermission):
#     def has_permission(self, request, view):
#         return (
#             request.user.is_authenticated and
#             request.user.role == 'collection_agent'
#        )
