from django.urls import path
from .views import (
    RoleListCreateAPIView,
    PermissionListCreateAPIView,
    AssignPermissionToRoleAPIView,
    AssignRoleToUserAPIView,
    UserRoleListAPIView,
    RolePermissionListAPIView,
)

urlpatterns = [
    # ROLES
    path("roles/", RoleListCreateAPIView.as_view(), name="roles"),

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

    path(
    "role-permissions/",
    RolePermissionListAPIView.as_view(),
    name="role-permissions",
),


    # USER ROLES
    path("user-roles/", UserRoleListAPIView.as_view(), name="user-roles"),
]
