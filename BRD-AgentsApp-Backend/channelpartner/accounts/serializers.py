from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import re

class UserSerializer(serializers.ModelSerializer):
    """
    Basic User Serializer
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'kyc_verified', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at', 'kyc_verified']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    User Registration Serializer with password validation
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'role', 'phone']
    
    def validate_username(self, value):
        """Validate username"""
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long")
        
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores")
        
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        
        return value
    
    def validate_email(self, value):
        """Validate email"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Invalid email format")
        
        return value
    
    def validate_phone(self, value):
        """Validate phone number"""
        if value:
            if not re.match(r'^[6-9]\d{9}$', value):
                raise serializers.ValidationError("Phone number must be 10 digits starting with 6-9")
        return value
    
    def validate_role(self, value):
        """Validate role - only PARTNER and CREDIT_OPS can register via API"""
        if value not in ['PARTNER', 'CREDIT_OPS']:
            raise serializers.ValidationError("Invalid role. Only PARTNER and CREDIT_OPS can register via API")
        return value
    
    def validate_password(self, value):
        """Validate password strength"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        
        # Check for at least one digit
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit")
        
        # Check for at least one letter
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("Password must contain at least one letter")
        
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        
        return data
    
    def create(self, validated_data):
        """Create user with hashed password"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    User Profile Serializer for viewing and updating profile
    """
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'phone', 
            'kyc_verified', 'profile_image', 'bank_account', 
            'ifsc_code', 'created_at'
        ]
        read_only_fields = ['id', 'username', 'role', 'created_at', 'kyc_verified']
    
    def validate_phone(self, value):
        """Validate phone number"""
        if value:
            if not re.match(r'^[6-9]\d{9}$', value):
                raise serializers.ValidationError("Phone number must be 10 digits starting with 6-9")
        return value
    
    def validate_ifsc_code(self, value):
        """Validate IFSC code"""
        if value:
            if not re.match(r'^[A-Z]{4}0[A-Z0-9]{6}$', value.upper()):
                raise serializers.ValidationError("Invalid IFSC code format")
            return value.upper()
        return value
    
    def validate_bank_account(self, value):
        """Validate bank account number"""
        if value:
            if not re.match(r'^\d{9,18}$', value):
                raise serializers.ValidationError("Bank account number must be 9-18 digits")
        return value


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Detailed User Serializer with statistics
    """
    total_leads = serializers.SerializerMethodField()
    converted_leads = serializers.SerializerMethodField()
    total_earnings = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'phone', 
            'kyc_verified', 'profile_image', 'bank_account', 
            'ifsc_code', 'created_at', 'total_leads', 
            'converted_leads', 'total_earnings'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_total_leads(self, obj):
        """Get total leads for partner"""
        if obj.role == 'PARTNER':
            return obj.partner_leads.count()
        return 0
    
    def get_converted_leads(self, obj):
        """Get converted (sanctioned) leads for partner"""
        if obj.role == 'PARTNER':
            return obj.partner_leads.filter(status='SANCTIONED').count()
        return 0
    
    def get_total_earnings(self, obj):
        """Get total earnings for partner"""
        if obj.role == 'PARTNER':
            from payouts.models import Payout
            from django.db.models import Sum
            total = Payout.objects.filter(partner=obj).aggregate(Sum('commission_amount'))['commission_amount__sum']
            return str(total) if total else "0"
        return "0"
