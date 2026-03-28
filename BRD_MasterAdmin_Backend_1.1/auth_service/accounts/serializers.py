from rest_framework import serializers
from .models import User


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class MeSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_staff",
            "groups",
            "permissions",
        ]

    def get_groups(self, user):
        return list(user.groups.values_list("name", flat=True))

    def get_permissions(self, user):
        return list(user.get_all_permissions())