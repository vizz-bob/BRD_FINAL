from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user model - handles all user fields
    """
    # Use source to map frontend fields to backend fields
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True, source='phone_number')
    mobile_no = serializers.CharField(required=False, allow_blank=True, source='phone_number', write_only=True)
    
    # Additional fields from your frontend
    tenant = serializers.IntegerField(required=False, allow_null=True)
    tenant_id = serializers.IntegerField(required=False, allow_null=True, source='tenant')
    role = serializers.CharField(required=False, allow_blank=True)
    role_type = serializers.CharField(required=False, allow_blank=True, source='role')
    role_id = serializers.IntegerField(required=False, allow_null=True)
    
    # Supervisor fields
    supervisor_name = serializers.CharField(required=False, allow_blank=True)
    supervisor_email = serializers.EmailField(required=False, allow_blank=True)
    supervisor_mobile = serializers.CharField(required=False, allow_blank=True)
    
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'phone', 'mobile_no',
            'tenant', 'tenant_id', 'role', 'role_type', 'role_id',
            'supervisor_name', 'supervisor_email', 'supervisor_mobile',
            'is_active', 'password'
        )
        read_only_fields = ('id',)
        extra_kwargs = {
            'password': {'write_only': True}
        }

