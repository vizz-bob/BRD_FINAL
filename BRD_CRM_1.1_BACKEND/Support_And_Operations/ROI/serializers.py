from rest_framework import serializers
from .models import Channel, ChannelAnalytics


class ChannelSerializer(serializers.ModelSerializer):
    """
    Serializer for the Channel model.
    Includes validation to ensure source_code uniqueness.
    """
    class Meta:
        model = Channel
        fields = '__all__'

    def validate_source_code(self, value):
        """
        Ensure that the source_code is unique across channels.
        """
        if Channel.objects.filter(source_code=value).exists():
            raise serializers.ValidationError("Source code already exists")
        return value


class ChannelAnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for the ChannelAnalytics model.
    Includes read-only computed fields: cpl, conversion_rate, roi.
    """
    cpl = serializers.ReadOnlyField()
    conversion_rate = serializers.ReadOnlyField()
    roi = serializers.ReadOnlyField()
    channel = serializers.CharField(source='channel.channel_name', read_only=True)

    class Meta:
        model = ChannelAnalytics
        fields = '__all__'
