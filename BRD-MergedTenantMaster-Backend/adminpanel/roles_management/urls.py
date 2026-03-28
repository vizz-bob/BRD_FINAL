from django.urls import path
from .views import (
    RoleListCreateAPIView,
    PermissionListAPIView,
    RolePermissionAPIView,
)

urlpatterns = [
    # Roles
    path("", RoleListCreateAPIView.as_view()),
    
    # Permissions
    path("permissions/", PermissionListAPIView.as_view()),

    # Role ↔ Permissions
    path("<uuid:role_id>/permissions/", RolePermissionAPIView.as_view()),
]
