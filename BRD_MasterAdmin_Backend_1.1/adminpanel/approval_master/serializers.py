from rest_framework import serializers
from .models import ApprovalMaster


class ApprovalMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalMaster
        fields = "__all__"

from .models import ApprovalAssignment, EscalationMaster


# class ApprovalAssignmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ApprovalAssignment
#         fields = "__all__"

class ApprovalAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalAssignment
        fields = "__all__"

    def validate(self, data):
        approver_type = data.get("approver_type")

        if approver_type == "INDIVIDUAL" and not data.get("user_id"):
            raise serializers.ValidationError(
                {"user_id": "User is required for Individual approver"}
            )

        if approver_type == "GROUP" and not data.get("group_users"):
            raise serializers.ValidationError(
                {"group_users": "At least one group user is required"}
            )

        return data



class EscalationMasterSerializer(serializers.ModelSerializer):
    escalation_time = serializers.DateTimeField(
        input_formats=["%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M"]
    )
    class Meta:
        model = EscalationMaster
        fields = "__all__"
