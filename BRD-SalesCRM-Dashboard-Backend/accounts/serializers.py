from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import (
    UserProfile, NotificationPreference, Availability,
    Territory, Integration, GeneralSettings, PrivacySettings,
    DataPrivacySettings
)


# ── Auth Serializers ─────────────────────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()  # Frontend sends 'email' field, but it might be an actual username
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email_or_username = data.get('email')
        password = data.get('password')
        
        # Try finding the user by email first, otherwise fallback to username
        user_obj = User.objects.filter(email=email_or_username).first()
        if not user_obj:
            user_obj = User.objects.filter(username=email_or_username).first()

        if user_obj:
            # Authenticate using their actual username in the DB
            user = authenticate(username=user_obj.username, password=password)
            if user:
                data['user'] = user
                return data

        raise serializers.ValidationError("Invalid credentials.")


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


# ── Profile ──────────────────────────────────────────────────────────────────

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name  = serializers.CharField(source='user.last_name')
    email      = serializers.EmailField(source='user.email')
    full_name  = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email',
            'phone', 'role', 'bio', 'timezone', 'language', 'avatar_initials',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at', 'full_name']

    def get_full_name(self, obj):
        return obj.user.get_full_name()

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        return super().update(instance, validated_data)


class TeamMemberAccountSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='get_full_name', read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    avatar = serializers.CharField(source='profile.avatar_initials', read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'avatar', 'status']

    def get_status(self, obj):
        return 'active' if obj.is_active else 'inactive'


# ── Notifications ─────────────────────────────────────────────────────────────

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        exclude = ['user', 'updated_at']


# ── Availability ──────────────────────────────────────────────────────────────

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        exclude = ['user']


# ── Security ──────────────────────────────────────────────────────────────────

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password     = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value


# ── Territory ─────────────────────────────────────────────────────────────────

class TerritorySerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(
        source='assigned_to.get_full_name', read_only=True
    )

    class Meta:
        model = Territory
        fields = [
            'id', 'name', 'pincode', 'assigned_to', 'assigned_to_name',
            'lead_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'lead_count', 'created_at', 'updated_at', 'assigned_to_name']


# ── Integrations ──────────────────────────────────────────────────────────────

class IntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integration
        fields = [
            'id', 'name', 'integration_type', 'status',
            'last_sync', 'features', 'settings', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ── General Settings ──────────────────────────────────────────────────────────

class GeneralSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralSettings
        exclude = ['user', 'updated_at']


# ── Privacy Settings ──────────────────────────────────────────────────────────

class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacySettings
        exclude = ['user', 'updated_at']


# ── Data & Privacy Settings ───────────────────────────────────────────────────

class DataPrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataPrivacySettings
        exclude = ['user']
        read_only_fields = ['id', 'leads_last_exported_at', 'reports_last_exported_at', 'updated_at']
