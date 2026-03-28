from rest_framework import serializers
from .models import (
    InternalDashboard,
    InternalPermission,
    InternalRole
)


class InternalPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalPermission
        fields = ["id", "code", "name"]


class InternalDashboardSerializer(serializers.ModelSerializer):
    permissions = InternalPermissionSerializer(many=True, read_only=True)

    class Meta:
        model = InternalDashboard
        fields = [
            "id",
            "code",
            "name",
            "description",
            "permissions",
        ]


class InternalRoleSerializer(serializers.ModelSerializer):
    dashboards = InternalDashboardSerializer(many=True, read_only=True)

    class Meta:
        model = InternalRole
        fields = [
            "id",
            "name",
            "dashboards",
            "is_active",
        ]
