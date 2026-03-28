from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ProfileSettings, UserDocument, PrivacyPolicy, SupportTicket, SupportContactInfo
from channelpartner.leads.models import Lead
from channelpartner.payouts.models import Payout
from django.db.models import Sum

User = get_user_model()

class ProfileSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileSettings
        fields = [
            'push_notifications', 'email_alerts', 'sms_notifications',
            'profile_visibility', 'show_phone', 'show_email', 
            'allow_contact_requests', 'allow_lead_sharing',
            'two_factor_enabled', 'login_alerts', 'suspicious_activity_alerts',
            'change_password_required', 'last_password_change', 'session_timeout_minutes',
            'require_ip_verification', 'blocked_ips',
            'dark_mode', 'language'
        ]
        read_only_fields = ['last_password_change', 'change_password_required']

class UserDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDocument
        fields = ['id', 'doc_type', 'file', 'verified', 'uploaded_at']

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    kyc_verified = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    partner_id = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()
    ifsc_code = serializers.SerializerMethodField()
    settings = ProfileSettingsSerializer(read_only=True)
    stats = serializers.SerializerMethodField()
    member_since = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone', 'role', 
            'kyc_verified', 'profile_image', 'partner_id', 
            'bank_account', 'ifsc_code', 'member_since', 
            'settings', 'stats'
        ]
        read_only_fields = ['partner_id', 'role', 'kyc_verified']

    def get_member_since(self, obj):
        joined = getattr(obj, 'date_joined', None)
        if not joined:
            return None
        return joined.strftime('%b %Y')

    def get_username(self, obj):
        username = getattr(obj, 'username', None)
        if username:
            return username
        email = getattr(obj, 'email', '') or ''
        return email.split('@')[0] if email else ''

    def get_phone(self, obj):
        return getattr(obj, 'phone', None) or getattr(obj, 'mobile', None)

    def get_kyc_verified(self, obj):
        return bool(getattr(obj, 'kyc_verified', False))

    def get_profile_image(self, obj):
        return getattr(obj, 'profile_image', None)

    def get_partner_id(self, obj):
        return getattr(obj, 'partner_id', None)

    def get_bank_account(self, obj):
        return getattr(obj, 'bank_account', None)

    def get_ifsc_code(self, obj):
        return getattr(obj, 'ifsc_code', None)

    def get_stats(self, obj):
        def resolve_user_for_model(source_user, target_model):
            if isinstance(source_user, target_model):
                return source_user

            email = getattr(source_user, 'email', None)
            if not email:
                return None

            return target_model.objects.filter(email=email).first()

        lead_partner_model = Lead._meta.get_field('partner').remote_field.model
        payout_partner_model = Payout._meta.get_field('partner').remote_field.model

        lead_user = resolve_user_for_model(obj, lead_partner_model)
        payout_user = resolve_user_for_model(obj, payout_partner_model)

        leads_qs = Lead.objects.filter(partner=lead_user) if lead_user else Lead.objects.none()
        total_leads = leads_qs.count()
        converted_leads = leads_qs.filter(status__in=['SANCTIONED', 'DISBURSED']).count()

        payouts_qs = Payout.objects.filter(partner=payout_user) if payout_user else Payout.objects.none()
        total_earnings = payouts_qs.aggregate(Sum('commission_amount'))['commission_amount__sum'] or 0
        
        return {
            'total_leads': total_leads,
            'converted_leads': converted_leads,
            'total_earnings': float(total_earnings)
        }

class PrivacyPolicySectionSerializer(serializers.ModelSerializer):
    """
    Serializer for Privacy Policy with all 10 sections
    """
    sections = serializers.SerializerMethodField()
    
    class Meta:
        model = PrivacyPolicy
        fields = [
            'id', 'title', 'introduction', 'is_active', 'version',
            'last_updated', 'sections', 'quick_summary', 'contact_us'
        ]
        read_only_fields = ['id', 'last_updated']
    
    def get_sections(self, obj):
        """Return all 10 privacy policy sections in organized format"""
        return {
            '1_information_we_collect': {
                'section_number': 1,
                'title': 'Information We Collect',
                'content': obj.information_we_collect
            },
            '2_how_we_use_information': {
                'section_number': 2,
                'title': 'How We Use Your Information',
                'content': obj.how_we_use_information
            },
            '3_information_sharing': {
                'section_number': 3,
                'title': 'Information Sharing',
                'content': obj.information_sharing
            },
            '4_data_security': {
                'section_number': 4,
                'title': 'Data Security',
                'content': obj.data_security
            },
            '5_your_rights_and_choices': {
                'section_number': 5,
                'title': 'Your Rights and Choices',
                'content': obj.your_rights_and_choices
            },
            '6_data_retention': {
                'section_number': 6,
                'title': 'Data Retention',
                'content': obj.data_retention
            },
            '7_cookies_and_tracking': {
                'section_number': 7,
                'title': 'Cookies and Tracking',
                'content': obj.cookies_and_tracking
            },
            '8_third_party_services': {
                'section_number': 8,
                'title': 'Third Party Services',
                'content': obj.third_party_services
            },
            '9_childrens_privacy': {
                'section_number': 9,
                'title': "Children's Privacy",
                'content': obj.childrens_privacy
            },
            '10_changes_to_policy': {
                'section_number': 10,
                'title': 'Changes to Privacy Policy',
                'content': obj.changes_to_policy
            }
        }


class SupportContactInfoSerializer(serializers.ModelSerializer):
    """
    Serializer for support contact information with action links
    """
    actions = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportContactInfo
        fields = ['phone_number', 'whatsapp_number', 'email', 'support_hours', 'is_active', 'actions']
    
    def get_actions(self, obj):
        """Return available contact actions"""
        return {
            'call': {
                'label': 'Call Us',
                'action': 'call',
                'value': obj.phone_number,
                'icon': 'phone',
                'enabled': obj.is_active
            },
            'whatsapp': {
                'label': 'WhatsApp Support',
                'action': 'whatsapp',
                'value': obj.whatsapp_number,
                'icon': 'whatsapp',
                'enabled': obj.is_active
            },
            'email': {
                'label': 'Email Support',
                'action': 'email',
                'value': obj.email,
                'icon': 'mail',
                'enabled': obj.is_active
            }
        }


class SupportTicketSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and managing support tickets
    """
    ticket_status_display = serializers.CharField(source='get_status_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'user', 'user_name', 'category', 'category_display',
            'issue_description', 'status', 'ticket_status_display',
            'assigned_to', 'response_notes', 'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['ticket_id', 'user', 'user_name', 'assigned_to', 'response_notes', 'created_at', 'updated_at', 'resolved_at', 'status']
    
    def validate_issue_description(self, value):
        """Validate issue description"""
        if len(value) < 10:
            raise serializers.ValidationError("Issue description must be at least 10 characters long")
        if len(value) > 2000:
            raise serializers.ValidationError("Issue description cannot exceed 2000 characters")
        return value
    
    def validate_category(self, value):
        """Validate category"""
        valid_categories = ['ACCOUNT', 'LEAD', 'TECHNICAL', 'PAYMENT', 'DOCUMENTATION', 'OTHER']
        if value not in valid_categories:
            raise serializers.ValidationError(f"Invalid category. Must be one of: {', '.join(valid_categories)}")
        return value