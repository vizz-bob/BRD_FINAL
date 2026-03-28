from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["name", "created_at"]
    ordering = ["-created_at"]

class RoleRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

# ---------- PERMISSIONS ----------
class PermissionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated] # Simplified for integration
    filter_backends = [filters.SearchFilter]
    search_fields = ["code", "description"]

# ---------- ASSIGN PERMISSION TO ROLE ----------
class AssignPermissionToRoleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = AssignPermissionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role_permissions = serializer.save()
        return Response({
            "role": serializer.validated_data["role"],
            "permissions": [rp.permission_id for rp in role_permissions]
        }, status=status.HTTP_201_CREATED)

# ---------- ASSIGN ROLE TO USER ----------
class AssignRoleToUserAPIView(generics.CreateAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated] # Simplified

# ---------- USER ROLES LIST ----------
class UserRoleListAPIView(generics.ListAPIView):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAuthenticated]

# ---------- ROLE PERMISSIONS LIST ----------
class RolePermissionListAPIView(generics.ListAPIView):
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        role_id = self.request.query_params.get("role")
        if role_id:
            return RolePermission.objects.filter(role_id=role_id)
        return RolePermission.objects.all()

# ---------- DJANGO ADMIN VIEW ----------
def create_role_with_permissions(request, role_id):
    """View to create/edit role with permission checkboxes"""
    from django.shortcuts import render, redirect, get_object_or_404
    from django.contrib import messages
    
    role = get_object_or_404(Role, id=role_id)
    
    if request.method == 'POST':
        # Get selected permissions
        selected_permissions = request.POST.getlist('permissions', [])
        
        # Clear existing permissions and set new ones
        role.permission.clear()
        role.permission.add(*selected_permissions)
        
        messages.success(request, f'Role "{role.name}" permissions updated successfully!')
        return redirect('admin:adminpanel_role_change', role_id)
    
    # Get all permissions grouped by category
    all_permissions = Permission.objects.all()
    permissions_by_category = {}
    
    for perm in all_permissions:
        category = get_permission_category(perm.code)
        if category not in permissions_by_category:
            permissions_by_category[category] = []
        permissions_by_category[category].append(perm)
    
    # Get current role permissions
    current_permissions = [str(p.permission.id) for p in role.permission.all()]
    
    context = {
        'role': role,
        'permissions_by_category': permissions_by_category,
        'current_permissions': current_permissions,
    }
    
    return render(request, 'admin/role_permissions.html', context)
