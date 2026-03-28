from rest_framework import serializers
from django.contrib.auth.models import Group
from auth_service.accounts.models import User
from .models import AdminUser
from adminpanel.access_control.models import Role


# class AdminUserCreateSerializer(serializers.Serializer):
#     # User fields
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)
#     phone_number = serializers.CharField(required=False, allow_blank=True)

#     # RBAC
#     # role_id = serializers.PrimaryKeyRelatedField(
#     #     queryset=Group.objects.all(),
#     #     source="role"
#     # )

#     role_id = serializers.UUIDField(write_only=True)
    

#     # Business fields
#     # organization = serializers.CharField(required=False, allow_blank=True)
#     # branch = serializers.CharField(required=False, allow_blank=True)
#     employee_id = serializers.CharField(required=False, allow_blank=True)
#     approval_limit = serializers.DecimalField(
#         max_digits=15, decimal_places=2, required=False
#     )

#     def create(self, validated_data):
#         # Extract role
#         role_id = validated_data.pop("role")

#         # Create AUTH user
#         user = User.objects.create_user(
#             email=validated_data.pop("email"),
#             password=validated_data.pop("password")
#         )

#         # Create ADMIN user
#         admin_user = AdminUser.objects.create(
#             user=user,
#             role=role,
#             **validated_data
#         )

#         return admin_user

class AdminUserCreateSerializer(serializers.Serializer):
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    # RBAC
    role_id = serializers.UUIDField(write_only=True)

    # Business fields
    employee_id = serializers.CharField(required=False, allow_blank=True)
    approval_limit = serializers.DecimalField(
        max_digits=15, decimal_places=2, required=False
    )

    def validate(self, attrs):
        role_id = attrs.get("role_id")

        try:
            role = Role.objects.get(id=role_id)
        except Role.DoesNotExist:
            raise serializers.ValidationError({
                "role_id": "Invalid role ID"
            })

        attrs["role"] = role  # attach actual Role object
        return attrs

    def create(self, validated_data):
        # Extract Role object
        role = validated_data.pop("role")

        # Create AUTH user
        user = User.objects.create_user(
            email=validated_data.pop("email"),
            password=validated_data.pop("password")
        )

        # Create AdminUser with role
        admin_user = AdminUser.objects.create(
            user=user,
            role=role,
            **validated_data
        )

        return admin_user

# serializers.py

class AdminUserUpdateSerializer(serializers.Serializer):
    phone_number = serializers.CharField(required=False, allow_blank=True)
    role_id = serializers.UUIDField(required=False)  # optional for update
    employee_id = serializers.CharField(required=False, allow_blank=True)
    approval_limit = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    is_active = serializers.BooleanField(required=False)

    def validate_role_id(self, value):
        if value:
            try:
                return Role.objects.get(id=value)
            except Role.DoesNotExist:
                raise serializers.ValidationError("Invalid role ID")
        return None

    def update(self, instance: AdminUser, validated_data):
        # Update role if provided
        role = validated_data.pop("role_id", None)
        if role:
            instance.role = role

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class AdminUserListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    role = serializers.CharField(source="role.name", default=None)

    class Meta:
        model = AdminUser
        fields = [
            "id",
            "email",
            "phone_number",
            "role",
            "employee_id",
            "approval_limit",
            "is_active",
            "created_at",
        ] 
