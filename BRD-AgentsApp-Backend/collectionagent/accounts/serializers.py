from rest_framework import serializers
from .models import (
    CollectionAccount,
    Recovery,
    FollowUp,
    CollectionProfile,
    VisitRecording,
    VisitPhoto,
    VisitAudioRecording,
)
from .models import RepossessionHistory

class CollectionAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionAccount
        fields = '__all__'

class RecoverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Recovery
        fields = '__all__'

class FollowUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUp
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    recoveries = RecoverySerializer(many=True, read_only=True)
    followups = FollowUpSerializer(many=True, read_only=True)

    class Meta:
        model = CollectionAccount
        fields = '__all__'

class CollectionProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionProfile
        fields = '__all__'


class RepossessionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RepossessionHistory
        fields = '__all__'


class VisitPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitPhoto
        fields = '__all__'
        read_only_fields = ('visit', 'captured_at')


class VisitAudioRecordingSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitAudioRecording
        fields = '__all__'
        read_only_fields = ('visit', 'recorded_at')


class VisitRecordingSerializer(serializers.ModelSerializer):
    photos = VisitPhotoSerializer(many=True, read_only=True)
    audio_recordings = VisitAudioRecordingSerializer(many=True, read_only=True)
    account_ref = serializers.CharField(source='account.account_id', read_only=True)

    class Meta:
        model = VisitRecording
        fields = '__all__'
        read_only_fields = ('agent', 'created_at', 'updated_at')