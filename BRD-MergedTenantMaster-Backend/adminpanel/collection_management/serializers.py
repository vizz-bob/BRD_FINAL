from rest_framework import serializers
from .models import *

class PaymentGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentGateway
        fields = "__all__"


class CollectionControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionControl
        fields = "__all__"


class ClientTeamMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientTeamMapping
        fields = "__all__"


class ClientAgentMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientAgentMapping
        fields = "__all__"


class PayoutManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutManagement
        fields = "__all__"


class OverdueLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverdueLoan
        fields = "__all__"


class CollectionStatsSerializer(serializers.ModelSerializer):
    efficiency = serializers.SerializerMethodField()
    
    class Meta:
        model = CollectionStats
        fields = "__all__"
    
    def get_efficiency(self, obj):
        return f"{obj.efficiency_rate}%"


class CollectionActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionAction
        fields = "__all__"


class CollectionStatsResponseSerializer(serializers.Serializer):
    totalOverdue = serializers.CharField()
    npaCases = serializers.IntegerField()
    efficiency = serializers.CharField()


class RecordActionSerializer(serializers.Serializer):
    action_type = serializers.CharField()
    remarks = serializers.CharField()
