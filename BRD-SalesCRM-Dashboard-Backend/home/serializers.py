from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import (
    Lead, Reminder, Notification, TeamMember, Resource, LeadStage
)


class UserBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'role']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_role(self, obj):
        try:
            return obj.team_member.get_role_display()
        except TeamMember.DoesNotExist:
            return 'Unknown'


class TeamMemberSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)

    class Meta:
        model = TeamMember
        fields = ['id', 'user', 'role', 'phone', 'city', 'monthly_target']


class LeadSerializer(serializers.ModelSerializer):
    assigned_to_detail = UserBasicSerializer(source='assigned_to', read_only=True)
    created_by_detail = UserBasicSerializer(source='created_by', read_only=True)
    stage_display = serializers.CharField(source='get_stage_display', read_only=True)
    loan_product_display = serializers.CharField(source='get_loan_product_display', read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'borrower_name', 'contact_number', 'city_region',
            'loan_product', 'loan_product_display', 'ticket_size',
            'internal_remarks', 'stage', 'stage_display',
            'assigned_to', 'assigned_to_detail',
            'created_by', 'created_by_detail',
            'pan_document', 'aadhaar_document', 'gst_document',
            'is_active', 'applied_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class LeadCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for mobile-first lead capture form"""
    pan_document = serializers.FileField(required=False)
    aadhaar_document = serializers.FileField(required=False)
    gst_document = serializers.FileField(required=False)

    class Meta:
        model = Lead
        fields = [
            'borrower_name', 'contact_number', 'city_region',
            'loan_product', 'ticket_size', 'internal_remarks', 'stage',
            'pan_document', 'aadhaar_document', 'gst_document', 'assigned_to'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ReminderSerializer(serializers.ModelSerializer):
    created_by_detail = UserBasicSerializer(source='created_by', read_only=True)
    lead_name = serializers.CharField(source='lead.borrower_name', read_only=True)
    reminder_type_display = serializers.CharField(source='get_reminder_type_display', read_only=True)
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Reminder
        fields = [
            'id', 'lead', 'lead_name', 'title', 'due_date',
            'reminder_type', 'reminder_type_display', 'notes',
            'created_by', 'created_by_detail',
            'is_completed', 'completed_at', 'is_overdue', 'created_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'completed_at']

    def get_is_overdue(self, obj):
        return not obj.is_completed and obj.due_date < timezone.now()

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    sent_by_detail = UserBasicSerializer(source='sent_by', read_only=True)
    recipients_detail = UserBasicSerializer(source='recipients', many=True, read_only=True)
    lead_name = serializers.CharField(source='lead.borrower_name', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'lead', 'lead_name', 'sent_by', 'sent_by_detail',
            'recipients', 'recipients_detail', 'message',
            'is_read', 'created_at'
        ]
        read_only_fields = ['sent_by', 'created_at']

    def create(self, validated_data):
        validated_data['sent_by'] = self.context['request'].user
        return super().create(validated_data)


class NotifyTeamSerializer(serializers.Serializer):
    """Serializer for Notify Team modal action"""
    lead_id = serializers.IntegerField(required=False)
    recipient_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        error_messages={'min_length': 'Select at least one team member.'}
    )
    message = serializers.CharField(min_length=1, max_length=1000)

    def validate_recipient_ids(self, value):
        existing = User.objects.filter(id__in=value).count()
        if existing != len(value):
            raise serializers.ValidationError("One or more selected users do not exist.")
        return value


# ── Dashboard Serializers ──────────────────────────────────────────────────────

class DashboardMetricsSerializer(serializers.Serializer):
    active_leads = serializers.IntegerField()
    active_leads_change_pct = serializers.FloatField()
    lead_to_application_pct = serializers.FloatField()
    lead_to_application_target = serializers.FloatField()
    avg_time_to_apply_hrs = serializers.FloatField()
    avg_time_improvement_hrs = serializers.FloatField()
    monthly_incentives = serializers.DecimalField(max_digits=12, decimal_places=2)


class ActiveLeadsReportSerializer(serializers.Serializer):
    current_value = serializers.IntegerField()
    target_label = serializers.CharField()
    weekly_data = serializers.ListField(child=serializers.DictField())

from resources.models import Resource as AppResource

class ResourceSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True)
    resource_type = serializers.CharField(source='file_type', read_only=True)
    size = serializers.CharField(source='file_size', read_only=True)
    link = serializers.URLField(source='external_link', read_only=True)

    class Meta:
        model = AppResource
        fields = ['id', 'title', 'category', 'resource_type', 'file', 'link', 'size', 'downloads', 'created_at']


