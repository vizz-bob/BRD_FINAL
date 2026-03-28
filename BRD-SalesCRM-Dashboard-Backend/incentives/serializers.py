from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Incentive, CommissionStatement

class UserBasicSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username

class IncentiveSerializer(serializers.ModelSerializer):
    team_member_detail = UserBasicSerializer(source='team_member', read_only=True)
    month_display = serializers.SerializerMethodField()

    class Meta:
        model = Incentive
        fields = ['id', 'team_member', 'team_member_detail', 'month', 'month_display',
                  'amount', 'disbursed_leads', 'notes', 'created_at']

    def get_month_display(self, obj):
        return obj.month.strftime('%B %Y')

class CurrentCommissionSerializer(serializers.Serializer):
    total = serializers.FloatField()
    disbursed_bonus = serializers.FloatField()
    conversion_bonus = serializers.FloatField()
    speed_bonus = serializers.FloatField()
    team_bonus = serializers.FloatField()
    disbursed_volume = serializers.FloatField()

class PaymentHistorySerializer(serializers.Serializer):
    month = serializers.CharField()
    amount = serializers.FloatField()
    status = serializers.CharField()

class CommissionStatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionStatement
        fields = '__all__'