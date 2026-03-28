from rest_framework import serializers
from .models import *


class BaseAgentSerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"


# class ChannelPartnerSerializer(BaseAgentSerializer):
#     class Meta(BaseAgentSerializer.Meta):
#         model = ChannelPartner

class ChannelPartnerSerializer(BaseAgentSerializer):
    # Accept readable agent type
    agent_type_name = serializers.CharField(write_only=True)

    # Return readable value
    agent_type_display = serializers.CharField(
        source="agent_type.name", read_only=True
    )

    class Meta(BaseAgentSerializer.Meta):
        model = ChannelPartner
        fields = "__all__"
        extra_kwargs = {
            "agent_type": {"read_only": True}
        }

    def create(self, validated_data):
        agent_type_name = validated_data.pop("agent_type_name")

        try:
            agent_type_obj = AgentType.objects.get(
                name__iexact=agent_type_name
            )
        except AgentType.DoesNotExist:
            raise serializers.ValidationError({
                "agent_type_name": "Invalid agent type"
            })

        validated_data["agent_type"] = agent_type_obj
        return super().create(validated_data)


class VerificationAgencySerializer(BaseAgentSerializer):
    class Meta(BaseAgentSerializer.Meta):
        model = VerificationAgency


class CollectionAgentSerializer(BaseAgentSerializer):
    class Meta(BaseAgentSerializer.Meta):
        model = CollectionAgent
