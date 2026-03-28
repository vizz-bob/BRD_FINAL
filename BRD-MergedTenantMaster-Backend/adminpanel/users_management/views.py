from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import AdminUser
from .serializers import (
    AdminUserCreateSerializer,
    AdminUserListSerializer,
)

# 🔐 ONLY MASTER ADMIN CAN MANAGE USERS
class IsMasterAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


class AdminUserCreateAPIView(APIView):
    permission_classes = [IsMasterAdmin]

    def post(self, request):
        serializer = AdminUserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        admin_user = serializer.save()

        return Response(
            {
                "message": "Admin user created successfully",
                "user_id": admin_user.user.id,
                "email": admin_user.user.email,
                "role": admin_user.role.name if admin_user.role else None,
            },
            status=status.HTTP_201_CREATED,
        )

# views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AdminUser
from .serializers import AdminUserUpdateSerializer, AdminUserListSerializer

class AdminUserUpdateAPIView(APIView):
    permission_classes = [IsMasterAdmin]

    def put(self, request, pk):
        try:
            admin_user = AdminUser.objects.get(id=pk)
        except AdminUser.DoesNotExist:
            return Response({"detail": "Admin user not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminUserUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(admin_user, serializer.validated_data)

        # Return updated user info
        return Response({
            "message": "Admin user updated successfully",
            "user_id": admin_user.user.id,
            "email": admin_user.user.email,
            "role": admin_user.role.name if admin_user.role else None,
            "phone_number": admin_user.phone_number,
            "employee_id": admin_user.employee_id,
            "approval_limit": admin_user.approval_limit,
            "is_active": admin_user.is_active,
        })



class AdminUserListAPIView(APIView):
    permission_classes = [IsMasterAdmin]

    def get(self, request):
        users = AdminUser.objects.all().order_by("-created_at")
        serializer = AdminUserListSerializer(users, many=True)
        return Response(serializer.data)


# views.py

class AdminUserDetailAPIView(APIView):
    permission_classes = [IsMasterAdmin]

    def get(self, request, pk):
        try:
            admin_user = AdminUser.objects.get(id=pk)
        except AdminUser.DoesNotExist:
            return Response({"detail": "Admin user not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminUserListSerializer(admin_user)
        return Response(serializer.data)
