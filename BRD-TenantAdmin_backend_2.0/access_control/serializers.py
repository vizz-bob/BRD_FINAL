from rest_framework import serializers
from .models import Role, Permission, RolePermission, UserRole


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = "__all__"


class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = "__all__"

# serializers.py
class AssignPermissionsSerializer(serializers.Serializer):
    role = serializers.UUIDField()
    permissions = serializers.ListField(
        child=serializers.UUIDField()
    )

    def create(self, validated_data):
        role_id = validated_data["role"]
        perm_ids = validated_data["permissions"]

        role_permissions = []
        for pid in perm_ids:
            rp, created = RolePermission.objects.get_or_create(
                role_id=role_id,
                permission_id=pid
            )
            role_permissions.append(rp)

        return role_permissions  # return list of instances
