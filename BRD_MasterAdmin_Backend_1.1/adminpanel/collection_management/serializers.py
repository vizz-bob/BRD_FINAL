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
