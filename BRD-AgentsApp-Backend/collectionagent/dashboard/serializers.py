from rest_framework import serializers
from .models import *

class DailyCollectionSerializer(serializers.ModelSerializer):
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = DailyCollection
        fields = '__all__'

    def get_percentage(self, obj):
        return obj.progress_percentage()


class AgentStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentStats
        fields = '__all__'


class BucketSerializer(serializers.ModelSerializer):
    class Meta:
        model = BucketSummary
        fields = '__all__'


class PTPSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.customer_name')

    class Meta:
        model = PTP
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class RecoveryHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecoveryHistory
        fields = '__all__'
        
class QuickStatsSerializer(serializers.Serializer):
    calls_made = serializers.IntegerField()
    field_visits = serializers.IntegerField()
    active_ptps = serializers.IntegerField()
    success_rate = serializers.FloatField()