from rest_framework import serializers
from .models import Communication, CommunicationAttachment

class CommunicationAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunicationAttachment
        fields = ['id', 'file', 'uploaded_at']

class CommunicationSerializer(serializers.ModelSerializer):
    attachments = CommunicationAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Communication
        fields = [
            'id', 'conversation_type', 'mode', 'lead_id', 'deal_id',
            'subject', 'message_content', 'created_by', 'timestamp',
            'scheduled_at', 'status', 'direction', 'attachments'
        ]
