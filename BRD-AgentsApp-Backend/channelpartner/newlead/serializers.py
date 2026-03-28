from rest_framework import serializers
from .models import NewLeadRequest
import re


class ProductTypeChoicesSerializer(serializers.Serializer):
    """Serializer to return available product type choices"""
    choices = serializers.SerializerMethodField()
    
    def get_choices(self, obj):
        """Return available product type choices for dropdown"""
        return [
            {'value': choice[0], 'label': choice[1]}
            for choice in NewLeadRequest.PRODUCT_TYPE_CHOICES
        ]
    
    def to_representation(self, instance):
        """Override to return choices without requiring instance"""
        return {
            'product_types': self.get_choices(None)
        }


class NewLeadRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for NewLeadRequest model with validation
    """
    
    class Meta:
        model = NewLeadRequest
        fields = [
            'id',
            'full_name',
            'mobile_number',
            'email',
            'pan_number',
            'aadhar_number',
            'address',
            'product_type',
            'loan_amount_required',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']
    
    def validate_full_name(self, value):
        """Validate full name"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Full name must be at least 3 characters long")
        return value.strip()
    
    def validate_mobile_number(self, value):
        """Validate mobile number - 10 digits starting with 6-9"""
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Mobile number must be 10 digits starting with 6-9")
        return value
    
    def validate_pan_number(self, value):
        """Validate PAN number"""
        if value and not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', value.upper()):
            raise serializers.ValidationError("PAN must be in format: ABCDE1234F")
        return value.upper() if value else value
    
    def validate_aadhar_number(self, value):
        """Validate Aadhaar number - 12 digits"""
        if value and not re.match(r'^\d{12}$', value):
            raise serializers.ValidationError("Aadhaar must be 12 digits")
        return value
    
    def validate_email(self, value):
        """Validate email format"""
        if value:
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, value):
                raise serializers.ValidationError("Invalid email format")
        return value
    
    def validate_loan_amount_required(self, value):
        """Validate loan amount"""
        if value <= 0:
            raise serializers.ValidationError("Loan amount must be greater than 0")
        if value > 100000000:  # 10 crores max
            raise serializers.ValidationError("Loan amount cannot exceed ₹10,00,00,000")
        return value
    
    def validate_product_type(self, value):
        """Validate product type against available choices"""
        valid_choices = [choice[0] for choice in NewLeadRequest.PRODUCT_TYPE_CHOICES]
        if value not in valid_choices:
            choices_display = ', '.join([f"{choice[0]} ({choice[1]})" for choice in NewLeadRequest.PRODUCT_TYPE_CHOICES])
            raise serializers.ValidationError(f"Invalid product type. Must be one of: {choices_display}")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        # Ensure at least one contact method (mobile is required, email is optional)
        if not data.get('mobile_number'):
            raise serializers.ValidationError("Mobile number is required")
        
        return data
