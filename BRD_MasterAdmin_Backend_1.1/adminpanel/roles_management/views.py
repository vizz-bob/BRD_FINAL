from django.contrib.auth.models import Group, Permission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    RoleSerializer,
    PermissionSerializer,
    RolePermissionUpdateSerializer
)


# =========================
# ROLES
# =========================

class RoleListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = Group.objects.all().order_by("name")
        return Response(RoleSerializer(roles, many=True).data)

    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        role = Group.objects.create(
            name=serializer.validated_data["name"]
        )
        return Response(
            RoleSerializer(role).data,
            status=status.HTTP_201_CREATED
        )


# =========================
# PERMISSIONS
# =========================

class PermissionListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        module = request.GET.get("module")

        permissions = Permission.objects.select_related("content_type")

        if module:
            permissions = permissions.filter(
                content_type__app_label=module
            )

        return Response(
            PermissionSerializer(permissions, many=True).data
        )


# =========================
# ROLE → PERMISSIONS
# =========================

class RolePermissionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, role_id):
        role = Group.objects.get(id=role_id)
        permissions = role.permissions.all()
        return Response(
            PermissionSerializer(permissions, many=True).data
        )

    def post(self, request, role_id):
        role = Group.objects.get(id=role_id)
        serializer = RolePermissionUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        permissions = Permission.objects.filter(
            id__in=serializer.validated_data["permission_ids"]
        )

        role.permissions.set(permissions)

        return Response(
            {"message": "Permissions updated successfully"}
        )
