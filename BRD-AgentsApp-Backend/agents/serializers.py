from rest_framework import serializers
from .models import Agent, Case #Recovery,FollowUp RecoveryHub,RecoveryHubPhoto
from django.contrib.auth import authenticate


ROLE_ALIASES = {
    'field_agent': 'field_agent',
    'field agent': 'field_agent',
    'collection_agent': 'collection_agent',
    'collection agent': 'collection_agent',
    'channel_partner': 'channel_partner',
    'channel partner': 'channel_partner',
    'channel partener': 'channel_partner',
    'admin': 'admin',
}


def normalize_role(role, default=None):
    if role is None:
        return default

    normalized = str(role).strip().lower().replace('-', '_')
    return ROLE_ALIASES.get(normalized)

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    mobile = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    role = serializers.CharField(required=False, default='field_agent')

    class Meta:
        model = Agent
        fields = ['email', 'mobile', 'password', 'role']

    def validate_role(self, value):
        resolved = normalize_role(value, default='field_agent')
        if not resolved:
            raise serializers.ValidationError('Invalid role')
        return resolved

    def create(self, validated_data):
        return Agent.objects.create_user(**validated_data)


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    role = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")

        requested_role = normalize_role(data.get('role'))
        actual_role = normalize_role(user.role, default=user.role)

        if not requested_role:
            raise serializers.ValidationError("Invalid role")

        if actual_role != requested_role:
            raise serializers.ValidationError("Role mismatch")

        data['user'] = user
        return data


class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'email', 'mobile', 'role']


class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'
        read_only_fields = ['agent']

from .models import AgentProfile, AgentEarnings, AgentAttendance, FieldVerification, Case,FieldVerificationPhoto,PrivacyPolicy,PrivacyPolicySection,PrivacyQuickSummary,FAQ,SupportContact,SupportTicket

class AgentEarningsSerializer(serializers.ModelSerializer):
    this_month = serializers.SerializerMethodField()
    last_month = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = AgentEarnings
        fields = ['this_month', 'last_month', 'total']

    def get_this_month(self, obj):
        return f"₹{obj.this_month:,.0f}"
    
    def get_last_month(self, obj):
        return f"₹{obj.last_month:,.0f}"
    
    def get_total(self, obj):
        return f"₹{obj.total:,.0f}"

class AgentAttendanceSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    punch_in = serializers.SerializerMethodField()
    punch_out = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = AgentAttendance
        fields = ['date', 'punch_in', 'punch_out', 'status']

    def get_date(self, obj):
        return obj.date.strftime('%b %d, %Y')
    
    def get_punch_in(self, obj):
        if obj.punch_in:
            return obj.punch_in.strftime('%I:%M %p')
        return None
    
    def get_punch_out(self, obj):
        if obj.punch_out:
            return obj.punch_out.strftime('%I:%M %p')
        return None
    
    def get_status(self, obj):
        return obj.get_status_display()

class AgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentProfile
        fields = '__all__'
        read_only_fields = ['agent']

class AgentProfileDetailSerializer(serializers.ModelSerializer):
    agentId = serializers.CharField(source='agent_code', read_only=True)
    mobile = serializers.CharField(source='agent.mobile', read_only=True)
    email = serializers.CharField(source='agent.email', read_only=True)
    deviceId = serializers.CharField(source='device_id', read_only=True)
    joinDate = serializers.SerializerMethodField()
    profileImage = serializers.CharField(source='profile_image', read_only=True)
    earnings = serializers.SerializerMethodField()
    attendance = serializers.SerializerMethodField()
    syncStatus = serializers.SerializerMethodField()
    
    class Meta:
        model = AgentProfile
        fields = ['agentId', 'name', 'email', 'mobile', 'branch', 'deviceId', 'joinDate', 'profileImage', 'earnings', 'attendance', 'syncStatus']
        read_only_fields = ['agentId', 'name', 'email', 'mobile']

    def get_earnings(self, obj):
        try:
            earnings = obj.agent.earnings
            serializer = AgentEarningsSerializer(earnings)
            data = serializer.data
            return data
        except AgentEarnings.DoesNotExist:
            return {'thisMonth': '₹0', 'lastMonth': '₹0', 'total': '₹0'}

    def get_attendance(self, obj):
        attendance = obj.agent.attendance_logs.all()[:10]  # Last 10 records
        serializer = AgentAttendanceSerializer(attendance, many=True)
        return [
            {
                'date': row.get('date'),
                'punchIn': row.get('punch_in'),
                'punchOut': row.get('punch_out'),
                'status': row.get('status'),
            }
            for row in serializer.data
        ]

    def get_joinDate(self, obj):
        if not obj.join_date:
            return None
        return obj.join_date.strftime('%b %Y')

    def get_syncStatus(self, obj):
        return {
            'lastSync': self._format_last_sync(obj.last_synced),
            'pendingItems': obj.pending_items,
            'status': obj.sync_status
        }
    
    def _format_last_sync(self, last_synced):
        if not last_synced:
            return 'Never'
        from django.utils.timezone import now
        from datetime import timedelta
        
        diff = now() - last_synced
        if diff.total_seconds() < 60:
            return 'Just now'
        elif diff.total_seconds() < 3600:
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        elif diff.total_seconds() < 86400:
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        else:
            days = diff.days
            return f"{days} day{'s' if days > 1 else ''} ago"
class FieldVerificationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldVerificationPhoto
        fields = '__all__'
class FieldVerificationSerializer(serializers.ModelSerializer):
    photos = FieldVerificationPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = FieldVerification
        fields = '__all__'
        read_only_fields = ['agent', 'distance_from_location']

    def validate(self, data):
        if data.get('distance_from_location', 0) > 50:
            raise serializers.ValidationError(
                "Move within 50 meters to submit verification."
            )
        return data

class CaseSerializer(serializers.ModelSerializer):
    verification = FieldVerificationSerializer(read_only=True)

    class Meta:
        model = Case
        fields = '__all__'
class PrivacyPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicy
        fields = '__all__'
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'
class SupportContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportContact
        fields = '__all__'
class SupportTicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ['agent', 'status', 'created_at']

    def create(self, validated_data):
        return SupportTicket.objects.create(
            agent=self.context['request'].user,
            **validated_data
        )
class PrivacyPolicySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicySection
        fields = ['order', 'title', 'content']
class PrivacyQuickSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyQuickSummary
        fields = ['point']
class PrivacyPolicySerializer(serializers.ModelSerializer):
    sections = PrivacyPolicySectionSerializer(many=True)
    quick_summary = PrivacyQuickSummarySerializer(many=True)

    class Meta:
        model = PrivacyPolicy
        fields = [
            'title',
            'introduction',
            'important_notice',
            'last_updated',
            'sections',
            'quick_summary',
        ]

# from .models import CollectionProfile, Account, Recovery
# class CollectionProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CollectionProfile
#         fields = '__all__'
#         read_only_fields = ['agent']
# class AccountSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Account
#         fields = '__all__'
#         read_only_fields = ['collection_agent']
# class RecoverySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Recovery
#         fields = '__all__'
#         read_only_fields = ['agent', 'collected_at']
# class FollowUpSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FollowUp
#         fields = '__all__'
#         read_only_fields = ['agent', 'created_at']
# class RecoveryHubPhotoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RecoveryHubPhoto
#         fields = '__all__'
# class RecoveryHubSerializer(serializers.ModelSerializer):
#     photos = RecoveryHubPhotoSerializer(many=True, read_only=True)

#     class Meta:
#         model = RecoveryHub
#         fields = '__all__'
#         read_only_fields = ['agent']
