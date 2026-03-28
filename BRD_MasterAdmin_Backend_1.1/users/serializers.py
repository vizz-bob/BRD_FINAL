from rest_framework import serializers
from .models import User, AuditLog, UserProfile, LoginActivity
from tenants.models import Tenant
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class TwoFASerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)

class UserSerializer(serializers.ModelSerializer):

    tenant = serializers.SlugRelatedField(
        slug_field='tenant_id',
        queryset=Tenant.objects.all(),
        required=False,
        allow_null=True
    )

    password = serializers.CharField(write_only=True, required=False)
    # avatar = serializers.ImageField(read_only=True)


    # NULL-SAFE
    tenant_name = serializers.SerializerMethodField()
    branch_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()


    class Meta:
        model = User
        fields = (
            "id", "email", "first_name", "last_name", "phone", "role",
            "tenant", "tenant_name", "branch", "branch_name", "avatar",
            "employee_id", "approval_limit","is_2fa_enabled",
            "is_active", "is_staff", "is_superuser",
            "created_at", "updated_at", "password"
        )
        read_only_fields = ("created_at", "updated_at")
    

    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None

    def get_tenant_name(self, obj):
        return obj.tenant.name if obj.tenant else None

    def get_branch_name(self, obj):
        return obj.branch.name if obj.branch else None

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        avatar = self.context['request'].FILES.get('avatar')  # ← handle uploaded file

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        if avatar:
            instance.avatar = avatar

        instance.save()
        return instance


    # def update(self, instance, validated_data):
    #     password = validated_data.pop('password', None)
    #     avatar = validated_data.pop('avatar', None)

    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)

    #         if password:
    #             instance.set_password(password)

    #         if avatar:
    #             instance.avatar = avatar

    #         instance.save()
    #         return instance


# Audit Log Serializer (इसे जैसा है वैसा ही रहने दें)
class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = AuditLog
        fields = '_all_'

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Email already registered.")
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role="MASTER_ADMIN",  # 🔒 FORCE ROLE
            is_active=True
        )


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "avatar",
            "role",
        )
        read_only_fields = ("id", "role", "avatar")


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class LoginActivitySerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = LoginActivity
        fields = "__all__"


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔥 ADD ROLE TO JWT
        token["role"] = user.role

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        request = self.context.get("request")

        # ❌ Inactive account
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")

        # ❌ Only MASTER_ADMIN allowed
        if user.role != "MASTER_ADMIN":
            LoginActivity.objects.create(
                user=user,
                ip_address=request.META.get("REMOTE_ADDR"),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                successful=False
            )
            raise serializers.ValidationError("Access restricted to Master Admins only.")

        # 🔐 Enforce 2FA if enabled
        if user.is_2fa_enabled:
            data["requires_2fa"] = True
            data.pop("access", None)
            data.pop("refresh", None)
            return data

        # ✅ Successful login
        LoginActivity.objects.create(
            user=user,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            successful=True
        )

        return data



class MasterAdminTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["tenant_id"] = user.tenant_id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        request = self.context.get("request")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        if user.role != "MASTER_ADMIN":
            LoginActivity.objects.create(
                user=user,
                ip_address=request.META.get("REMOTE_ADDR"),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                successful=False
            )
            raise serializers.ValidationError("Master Admin access only")

        LoginActivity.objects.create(
            user=user,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            successful=True
        )

        return data


class TenantTokenSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["tenant_id"] = user.tenant_id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        request = self.context.get("request")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        # ❌ Block Master Admin here if you want
        if user.role == "MASTER_ADMIN":
            raise serializers.ValidationError(
                "Master Admin must login via Master Panel"
            )

        LoginActivity.objects.create(
            user=user,
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            successful=True
        )

        return data

