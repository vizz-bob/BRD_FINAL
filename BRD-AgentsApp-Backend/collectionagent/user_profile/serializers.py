from rest_framework import serializers
from .models import AgentProfile, Performance, Collection, AppSettings
from .models import (
    PrivacyPolicy,
    PrivacyPolicySection,
    PrivacyQuickSummary,
    FAQ,
    SupportContact,
    SupportTicket
)

class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = '__all__'


class PerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = '__all__'


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'


class AppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppSettings
        fields = '__all__'



class PrivacyPolicySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicySection
        fields = ['order', 'title', 'content']


class PrivacyQuickSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyQuickSummary
        fields = ['point']


class PrivacyPolicySerializer(serializers.ModelSerializer):
    sections = PrivacyPolicySectionSerializer(many=True, read_only=True)
    quick_summary = PrivacyQuickSummarySerializer(many=True, read_only=True)

    class Meta:
        model = PrivacyPolicy
        fields = [
            'id',
            'title',
            'introduction',
            'important_notice',
            'last_updated',
            'sections',
            'quick_summary'
        ]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer']


class SupportContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportContact
        fields = ['phone_number', 'whatsapp_number', 'support_email']


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = [
            'id',
            'issue_category',
            'issue_description',
            'status',
            'created_at'
        ]
        read_only_fields = ['status', 'created_at']
