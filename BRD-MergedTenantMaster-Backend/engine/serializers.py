# from rest_framework import serializers
# from .models import (
#     AccessRule,
#     WorkflowRule,
#     ValidationRule,
#     AssignmentRule,
#     SecurityRule,
# )


# # rules/serializers.py
# from rest_framework import serializers
# from .models import TenantRuleConfig

# class TenantRuleConfigSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TenantRuleConfig
#         fields = ["id", "tenant", "config"]


# class BaseRuleSerializer(serializers.ModelSerializer):
#     class Meta:
#         fields = "__all__"


# class AccessRuleSerializer(BaseRuleSerializer):
#     class Meta(BaseRuleSerializer.Meta):
#         model = AccessRule


# class WorkflowRuleSerializer(BaseRuleSerializer):
#     class Meta(BaseRuleSerializer.Meta):
#         model = WorkflowRule


# class ValidationRuleSerializer(BaseRuleSerializer):
#     class Meta(BaseRuleSerializer.Meta):
#         model = ValidationRule


# class AssignmentRuleSerializer(BaseRuleSerializer):
#     class Meta(BaseRuleSerializer.Meta):
#         model = AssignmentRule


# class SecurityRuleSerializer(BaseRuleSerializer):
#     class Meta(BaseRuleSerializer.Meta):
#         model = SecurityRule


from rest_framework import serializers
from .models import TenantRule

class TenantRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantRule
        fields = ["id", "tenant", "config", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
