from rest_framework import serializers
from .models import Lead, LeadQuery, LeadDocument, LeadActivity, LeadComment, SanctionedLead, Customer, LeadStatusHistory
from django.core.validators import RegexValidator
from decimal import Decimal
import re

class ProductTypeChoicesSerializer(serializers.Serializer):
    """Serializer to return available product type choices"""
    def to_representation(self, instance):
        """Return available product type choices for dropdown"""
        return {
            'product_types': [
                {'value': choice[0], 'label': choice[1]}
                for choice in Lead.PRODUCT_TYPE_CHOICES
            ]
        }

class LeadSerializer(serializers.ModelSerializer):
    """
    Serializer for Lead model with validation
    """
    partner_name = serializers.CharField(source='partner.username', read_only=True)
    credit_ops_name = serializers.CharField(source='credit_ops.username', read_only=True, allow_null=True)
    expected_commission = serializers.SerializerMethodField()
    query_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['lead_id', 'partner', 'created_at', 'updated_at']
    
    def get_expected_commission(self, obj):
        """Calculate expected commission (default 2.5%)"""
        commission_percentage = Decimal('2.50')
        commission_amount = (obj.amount * commission_percentage) / Decimal('100')
        return str(commission_amount)
    
    def get_query_count(self, obj):
        """Get count of open queries"""
        return obj.queries.filter(status='OPEN').count()
    
    def validate_mobile(self, value):
        """Validate mobile number"""
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Mobile number must be 10 digits starting with 6-9")
        return value
    
    def validate_pan(self, value):
        """Validate PAN number"""
        if value and not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', value.upper()):
            raise serializers.ValidationError("PAN must be in format: ABCDE1234F")
        return value.upper() if value else value
    
    def validate_aadhaar(self, value):
        """Validate Aadhaar number"""
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
    
    def validate_amount(self, value):
        """Validate loan amount"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        if value > 100000000:  # 10 crores max
            raise serializers.ValidationError("Amount cannot exceed ₹10,00,00,000")
        return value
    
    def validate_product_type(self, value):
        """Validate product type against available choices"""
        valid_choices = [choice[0] for choice in Lead.PRODUCT_TYPE_CHOICES]
        if value not in valid_choices:
            choices_display = ', '.join([f"{choice[0]} ({choice[1]})" for choice in Lead.PRODUCT_TYPE_CHOICES])
            raise serializers.ValidationError(f"Invalid product type. Must be one of: {choices_display}")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        # Ensure at least one contact method
        if not data.get('mobile') and not data.get('email'):
            raise serializers.ValidationError("Either mobile or email must be provided")
        
        return data


class LeadQuerySerializer(serializers.ModelSerializer):
    """
    Serializer for Lead Queries
    """
    raised_by_name = serializers.CharField(source='raised_by.username', read_only=True)
    lead_id = serializers.CharField(source='lead.lead_id', read_only=True)
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    
    class Meta:
        model = LeadQuery
        fields = '__all__'
        read_only_fields = ['raised_by', 'created_at', 'updated_at', 'resolved_at']
    
    def validate_title(self, value):
        """Validate title"""
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long")
        return value


class LeadDocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for Lead Documents
    """
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    lead_id = serializers.CharField(source='lead.lead_id', read_only=True)
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = LeadDocument
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'uploaded_at', 'verified_by', 'verified_at']
    
    def get_file_size(self, obj):
        """Get file size in KB"""
        if obj.document_file:
            return f"{obj.document_file.size / 1024:.2f} KB"
        return "0 KB"
    
    def validate_document_file(self, value):
        """Validate file size (max 5MB)"""
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB")
        return value


class LeadActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for Lead Activities
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    lead_id = serializers.CharField(source='lead.lead_id', read_only=True)
    
    class Meta:
        model = LeadActivity
        fields = '__all__'
        read_only_fields = ['created_at']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class LeadStatusHistorySerializer(serializers.ModelSerializer):
    updated_by_name = serializers.CharField(source='updated_by.username', read_only=True)
    
    class Meta:
        model = LeadStatusHistory
        fields = '__all__'
        read_only_fields = ['updated_by', 'updated_at']


class LeadCommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Lead Comments
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)
    lead_id = serializers.CharField(source='lead.lead_id', read_only=True)
    
    class Meta:
        model = LeadComment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate_comment(self, value):
        """Validate comment"""
        if len(value) < 3:
            raise serializers.ValidationError("Comment must be at least 3 characters long")
        return value


class LeadStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating lead status only
    """
    class Meta:
        model = Lead
        fields = ['status']
    
    def validate_status(self, value):
        """Validate status transitions"""
        valid_statuses = ['ACTIVE', 'UNDER_REVIEW', 'SANCTIONED', 'REJECTED']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
        return value


class LeadDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer with all related information
    """
    partner_details = serializers.SerializerMethodField()
    credit_ops_details = serializers.SerializerMethodField()
    payout_details = serializers.SerializerMethodField()
    expected_commission = serializers.SerializerMethodField()
    queries = LeadQuerySerializer(many=True, read_only=True)
    documents = LeadDocumentSerializer(many=True, read_only=True)
    activities = LeadActivitySerializer(many=True, read_only=True)
    comments = LeadCommentSerializer(many=True, read_only=True)
    customer_info = CustomerSerializer(read_only=True)
    status_history = LeadStatusHistorySerializer(many=True, read_only=True)
    open_query_count = serializers.SerializerMethodField()
    quick_actions = serializers.SerializerMethodField()
    call_action = serializers.SerializerMethodField()
    whatsapp_action = serializers.SerializerMethodField()
    email_action = serializers.SerializerMethodField()
    upload_action = serializers.SerializerMethodField()
    sms_action = serializers.SerializerMethodField()
    
    class Meta:
        model = Lead
        fields = [
            'id', 'lead_id', 'partner', 'credit_ops', 'name', 'mobile', 'email',
            'address', 'pan', 'aadhaar', 'pan_image', 'aadhaar_image',
            'product_type', 'amount', 'status', 'created_at', 'updated_at',
            'partner_details', 'credit_ops_details', 'payout_details',
            'expected_commission', 'queries', 'documents', 'activities',
            'comments', 'customer_info', 'status_history', 'open_query_count',
            'quick_actions', 'call_action', 'whatsapp_action', 'email_action',
            'upload_action', 'sms_action'
        ]
    
    def get_partner_details(self, obj):
        if obj.partner:
            return {
                'id': obj.partner.id,
                'username': obj.partner.username,
                'email': obj.partner.email,
                'phone': obj.partner.phone
            }
        return None
    
    def get_credit_ops_details(self, obj):
        if obj.credit_ops:
            return {
                'id': obj.credit_ops.id,
                'username': obj.credit_ops.username,
                'email': obj.credit_ops.email
            }
        return None
    
    def get_payout_details(self, obj):
        """Get payout information if exists"""
        try:
            from payouts.models import Payout
            payout = Payout.objects.filter(lead=obj).first()
            if payout:
                return {
                    'id': payout.id,
                    'commission_amount': str(payout.commission_amount),
                    'commission_percentage': str(payout.commission_percentage),
                    'disbursed_amount': str(payout.disbursed_amount),
                    'status': payout.status,
                    'created_at': payout.created_at
                }
        except:
            pass
        return None
    
    def get_expected_commission(self, obj):
        """Calculate expected commission"""
        commission_percentage = Decimal('2.50')
        commission_amount = (obj.amount * commission_percentage) / Decimal('100')
        return str(commission_amount)
    
    def get_open_query_count(self, obj):
        """Get count of open queries"""
        return obj.queries.filter(status='OPEN').count()
    
    def get_quick_actions(self, obj):
        """Get available quick actions for view details"""
        return {
            'call': self.get_call_action(obj),
            'whatsapp': self.get_whatsapp_action(obj),
            'email': self.get_email_action(obj),
            'upload': self.get_upload_action(obj),
            'sms': self.get_sms_action(obj)
        }

    def get_call_action(self, obj):
        return {
            'label': 'Call',
            'action': 'call',
            'url': f'/api/leads/{obj.id}/call_link/',
            'value': obj.mobile,
            'enabled': bool(obj.mobile),
            'icon': 'phone'
        }

    def get_whatsapp_action(self, obj):
        return {
            'label': 'WhatsApp',
            'action': 'whatsapp',
            'url': f'/api/leads/{obj.id}/send_whatsapp/',
            'value': obj.mobile,
            'enabled': bool(obj.mobile),
            'icon': 'whatsapp'
        }

    def get_email_action(self, obj):
        return {
            'label': 'Email',
            'action': 'email',
            'url': f'/api/leads/{obj.id}/send_email/',
            'value': obj.email,
            'enabled': bool(obj.email),
            'icon': 'mail'
        }

    def get_upload_action(self, obj):
        return {
            'label': 'Upload Document',
            'action': 'upload',
            'url': f'/api/leads/{obj.id}/upload_document/',
            'enabled': True,
            'icon': 'upload'
        }

    def get_sms_action(self, obj):
        return {
            'label': 'Send SMS',
            'action': 'sms',
            'url': f'/api/leads/{obj.id}/send_sms/',
            'value': obj.mobile,
            'enabled': bool(obj.mobile),
            'icon': 'message'
        }
