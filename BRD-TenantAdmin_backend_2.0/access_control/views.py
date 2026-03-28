from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Role, Permission, RolePermission, UserRole
from .serializers import (
    RoleSerializer,
    PermissionSerializer,
    RolePermissionSerializer,
    AssignPermissionsSerializer,
    UserRoleSerializer,
)

from .permissions import (
    CanManageRoles,
    CanManagePermissions,
    CanAssignRoles,
)



# ---------- ROLES ----------
class RoleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [CanManageRoles]



# ---------- PERMISSIONS ----------
class PermissionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [CanManagePermissions]



# ---------- ASSIGN PERMISSION TO ROLE ----------
# class AssignPermissionToRoleAPIView(generics.CreateAPIView):
#     queryset = RolePermission.objects.all()
#     serializer_class = RolePermissionSerializer
#     permission_classes = [CanManagePermissions]
class AssignPermissionToRoleAPIView(generics.CreateAPIView):
    serializer_class = AssignPermissionsSerializer
    permission_classes = [CanManagePermissions]



# ---------- ASSIGN ROLE TO USER ----------
class AssignRoleToUserAPIView(generics.CreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [CanAssignRoles]



# ---------- USER ROLES LIST ----------
class UserRoleListAPIView(generics.ListAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated]

# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import RolePermission
from .serializers import RolePermissionSerializer

class RolePermissionListAPIView(generics.ListAPIView):
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role_id = self.request.query_params.get("role")
        if role_id:
            return RolePermission.objects.filter(role_id=role_id)
        return RolePermission.objects.none()


# views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class AssignPermissionToRoleAPIView(APIView):
    permission_classes = [CanManagePermissions]

    def post(self, request, *args, **kwargs):
        serializer = AssignPermissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role_permissions = serializer.save()
        # Return custom response
        return Response({
            "role": serializer.validated_data["role"],
            "permissions": [rp.permission_id for rp in role_permissions]
        }, status=status.HTTP_201_CREATED)
