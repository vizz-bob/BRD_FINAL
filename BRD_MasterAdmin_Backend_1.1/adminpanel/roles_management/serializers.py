from rest_framework import serializers
from django.contrib.auth.models import Group, Permission


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]


class PermissionSerializer(serializers.ModelSerializer):
    code = serializers.SerializerMethodField()

    class Meta:
        model = Permission
        fields = ["id", "name", "code"]

    def get_code(self, obj):
        return f"{obj.content_type.app_label}.{obj.codename}"


class RolePermissionUpdateSerializer(serializers.Serializer):
    permission_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True
    )
