from django.urls import path
from .views import (
    RoleListCreateAPIView,
    RoleRetrieveUpdateDestroyAPIView,
    PermissionListCreateAPIView,
    AssignPermissionToRoleAPIView,
    AssignRoleToUserAPIView,
    UserRoleListAPIView,
    RolePermissionListAPIView,
    create_role_with_permissions,
)

urlpatterns = [
    # ROLES
    path("roles/", RoleListCreateAPIView.as_view(), name="roles"),
    path("roles/<uuid:pk>/", RoleRetrieveUpdateDestroyAPIView.as_view(), name="role-detail"),

    # PERMISSIONS
    path("permissions/", PermissionListCreateAPIView.as_view(), name="permissions"),

    # ROLE ↔ PERMISSION
    path(
        "assign-permission/",
        AssignPermissionToRoleAPIView.as_view(),
        name="assign-permission",
    ),

    # USER ↔ ROLE
    path(
        "assign-role/",
        AssignRoleToUserAPIView.as_view(),
        name="assign-role",
    ),

    # USER ROLES
    path("user-roles/", UserRoleListAPIView.as_view(), name="user-roles"),

    # ROLE PERMISSIONS LIST
    path("role-permissions/", RolePermissionListAPIView.as_view(), name="role-permissions"),

    # DJANGO ADMIN VIEW
    path("role-permissions/<uuid:role_id>/", create_role_with_permissions, name="admin_role_permissions"),
]
