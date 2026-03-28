from rest_framework import serializers
from django.utils import timezone
from .models import (
    EmailCampaign,
    DialerCampaign,
    SmsCampaign,
    WhatsAppCampaign,
    VoiceBroadcastCampaign,
    SocialMediaCampaign,
)


# =====================================================
# COMMON MIXIN FOR SCHEDULE VALIDATION
# =====================================================

class ScheduleValidationMixin:
    """
    Ensures:
    - schedule_datetime is required if timing = schedule
    - schedule_datetime cannot be in the past
    - schedule_datetime is cleared if timing = now
    """

    def validate(self, data):
        timing = data.get("timing")
        schedule_datetime = data.get("schedule_datetime")

        if timing == "schedule":
            if not schedule_datetime:
                raise serializers.ValidationError(
                    {"schedule_datetime": "Schedule date & time is required."}
                )
            if schedule_datetime < timezone.now():
                raise serializers.ValidationError(
                    {"schedule_datetime": "Scheduled time cannot be in the past."}
                )

        if timing == "now":
            data["schedule_datetime"] = None

        return data


# =====================================================
# EMAIL CAMPAIGN
# =====================================================

class EmailCampaignSerializer(ScheduleValidationMixin, serializers.ModelSerializer):

    class Meta:
        model = EmailCampaign
        fields = "__all__"

    def validate_sender_email(self, value):
        return value.lower()


# =====================================================
# DIALER CAMPAIGN
# =====================================================

class DialerCampaignSerializer(ScheduleValidationMixin, serializers.ModelSerializer):

    class Meta:
        model = DialerCampaign
        fields = "__all__"

    def validate_followup_retry_hours(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Follow-up retry hours cannot be negative."
            )
        return value


# =====================================================
# SMS CAMPAIGN
# =====================================================

class SmsCampaignSerializer(ScheduleValidationMixin, serializers.ModelSerializer):

    class Meta:
        model = SmsCampaign
        fields = "__all__"

    def validate_sender_id(self, value):
        value = value.strip().upper()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Sender ID must be at least 3 characters."
            )
        return value

    def validate_message_content(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError(
                "Message content is too short."
            )
        return value


# =====================================================
# WHATSAPP CAMPAIGN
# =====================================================

class WhatsAppCampaignSerializer(ScheduleValidationMixin, serializers.ModelSerializer):

    class Meta:
        model = WhatsAppCampaign
        fields = "__all__"

    def validate_message_body(self, value):
        if value and len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Message body is too short."
            )
        return value


# =====================================================
# VOICE BROADCAST CAMPAIGN
# =====================================================

class VoiceBroadcastCampaignSerializer(
    ScheduleValidationMixin, serializers.ModelSerializer
):

    class Meta:
        model = VoiceBroadcastCampaign
        fields = "__all__"

    def validate(self, data):
        data = super().validate(data)

        voice_source = data.get("voice_source")
        audio_file = data.get("audio_file")

        if voice_source == "upload" and not audio_file:
            raise serializers.ValidationError(
                {"audio_file": "Audio file is required when voice source is 'upload'."}
            )

        return data


# =====================================================
# SOCIAL MEDIA CAMPAIGN
# =====================================================

class SocialMediaCampaignSerializer(
    ScheduleValidationMixin, serializers.ModelSerializer
):

    class Meta:
        model = SocialMediaCampaign
        fields = "__all__"

    def validate_hashtags(self, value):
        if value:
            tags = [tag.strip() for tag in value.split(",")]
            if any(len(tag) < 2 for tag in tags):
                raise serializers.ValidationError(
                    "Each hashtag must contain at least 2 characters."
                )
        return value
