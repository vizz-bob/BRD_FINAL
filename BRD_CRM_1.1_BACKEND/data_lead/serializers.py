from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    Lead,
    CampaignLead,
    ThirdPartyLead,
    InternalLead,
    LeadAssignmentHistory,
    OnlineLead,
    UsedLead,
    UsedLeadAssignmentHistory,
    ArchivedLead,
    UploadData,
    AllocateData,
    ReallocateAssignedLead,
    Product,
)

User = get_user_model()


# ─────────────────────────────────────────────────────────────────────────────
# Lead
# ─────────────────────────────────────────────────────────────────────────────

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Lead
        fields = "__all__"


# ─────────────────────────────────────────────────────────────────────────────
# CampaignLead
# ─────────────────────────────────────────────────────────────────────────────

class CampaignLeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(
        source="assigned_to.username", read_only=True
    )
    product_name = serializers.CharField(
        source="product.name", read_only=True, default=""
    )
    campaign_name = serializers.CharField(
        source="campaign.name", read_only=True, default=""
    )
    assigned_users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model  = CampaignLead
        fields = "__all__"
        read_only_fields = ["status", "error_message", "created_at"]

    def create(self, validated_data):
        assigned_users = validated_data.pop("assigned_users", [])
        instance = super().create(validated_data)
        if assigned_users:
            instance.assigned_users.set(assigned_users)
        return instance

    def update(self, instance, validated_data):
        assigned_users = validated_data.pop("assigned_users", None)
        instance = super().update(instance, validated_data)
        if assigned_users is not None:
            instance.assigned_users.set(assigned_users)
        return instance


# ─────────────────────────────────────────────────────────────────────────────
# ThirdPartyLead
# ─────────────────────────────────────────────────────────────────────────────

class ThirdPartyLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ThirdPartyLead
        fields = "__all__"
        read_only_fields = ["status", "error_message", "created_at"]

    def validate(self, data):
        source = data.get("upload_method")
        if source == "Api Integration" and not data.get("api_endpoint"):
            raise serializers.ValidationError("API endpoint required")
        if source == "Manual Entry" and not data.get("manual_entry"):
            raise serializers.ValidationError("Manual entry required")
        if source == "File" and not data.get("upload_file"):
            raise serializers.ValidationError("File required")
        return data


# ─────────────────────────────────────────────────────────────────────────────
# InternalLead
# ─────────────────────────────────────────────────────────────────────────────

class InternalLeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField(read_only=True)
    assigned_users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model  = InternalLead
        fields = "__all__"
        read_only_fields = ("id", "created_at")

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None

    def create(self, validated_data):
        assigned_users = validated_data.pop("assigned_users", [])
        instance = super().create(validated_data)
        if assigned_users:
            instance.assigned_users.set(assigned_users)
        return instance

    def update(self, instance, validated_data):
        assigned_users = validated_data.pop("assigned_users", None)
        instance = super().update(instance, validated_data)
        if assigned_users is not None:
            instance.assigned_users.set(assigned_users)
        return instance


# ─────────────────────────────────────────────────────────────────────────────
# OnlineLead
# ─────────────────────────────────────────────────────────────────────────────

class OnlineLeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField(read_only=True)
    assigned_users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        required=False,
        allow_empty=True,
    )

    class Meta:
        model  = OnlineLead
        fields = "__all__"
        read_only_fields = ("id", "created_at")

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None

    def create(self, validated_data):
        assigned_users = validated_data.pop("assigned_users", [])
        instance = super().create(validated_data)
        if assigned_users:
            instance.assigned_users.set(assigned_users)
        return instance

    def update(self, instance, validated_data):
        assigned_users = validated_data.pop("assigned_users", None)
        instance = super().update(instance, validated_data)
        if assigned_users is not None:
            instance.assigned_users.set(assigned_users)
        return instance


# ─────────────────────────────────────────────────────────────────────────────
# UsedLead  ← THE FIX IS HERE
#
# Root cause of the 500:
#   DRF's ModelSerializer auto-discovers all model fields INCLUDING
#   GenericForeignKey (`lead_object`).  DRF has NO handler for GFK and raises
#   an unhandled exception during serialization → 500.
#
# Fix:
#   1. Explicitly list `fields` (never use '__all__' on a model with a GFK).
#   2. Declare `lead_object` as a custom read-only LeadObjectField that safely
#      introspects the concrete object at runtime.
#   3. Add prefetch_related("lead_object") on the ViewSet queryset (see views.py).
# ─────────────────────────────────────────────────────────────────────────────

class LeadObjectField(serializers.Field):
    """
    Safe read-only serializer for the GenericForeignKey `lead_object`.
    Returns a flat dict of contact fields regardless of which concrete
    lead model the row points at.  Returns {} when the object is missing
    instead of raising ObjectDoesNotExist.
    """

    def to_representation(self, value):
        if value is None:
            return {}
        return {
            "id":            getattr(value, "id",            None),
            "contact_name":  getattr(value, "contact_name",  None),
            "contact_phone": getattr(value, "contact_phone", None),
            "contact_email": getattr(value, "contact_email", None),
            "lead_status":   getattr(value, "lead_status",   None),
            "lead_quality":  getattr(value, "lead_quality",  None),
            "product":       str(getattr(value, "product",   "") or ""),
            "notes":         getattr(value, "notes",         None),
            "created_at":    str(getattr(value, "created_at","") or ""),
            # model-specific source fields
            "source_type":        value.__class__.__name__.lower(),
            "lead_source":        getattr(value, "lead_source",       None),  # CampaignLead
            "third_party_source": getattr(value, "third_party_source",None),  # ThirdPartyLead
            "internal_source":    getattr(value, "internal_source",   None),  # InternalLead
            "online_source":      getattr(value, "online_source",     None),  # OnlineLead
            "campaign_name":      getattr(value, "campaign_name",     None),
            "tags":               getattr(value, "tags",              None),
        }

    def to_internal_value(self, data):
        raise serializers.ValidationError("lead_object is read-only.")


class AllocatedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ["id", "username"]


class UsedLeadSerializer(serializers.ModelSerializer):
    # ← replaces the broken auto-field
    lead_object = LeadObjectField(read_only=True)

    # nested read; accepts plain PK on write
    allocated_to = AllocatedUserSerializer(read_only=True)
    allocated_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="allocated_to",
        write_only=True,
        required=False,
        allow_null=True,
    )

    product_name = serializers.SerializerMethodField()

    class Meta:
        model  = UsedLead
        # IMPORTANT: explicit field list — never use '__all__' here
        fields = [
            "id",
            "lead_object",
            "content_type",
            "object_id",
            "Source",
            "agent",
            "product",
            "product_name",
            "outcome",
            "status",
            "is_active",
            "allocated_to",
            "allocated_to_id",
            "last_contacted_at",
            "last_follow_up",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id", "lead_object", "content_type", "object_id",
            "created_at", "updated_at",
        ]

    def get_product_name(self, obj):
        try:
            return obj.product.name if obj.product else None
        except Exception:
            return None


class UsedLeadAssignmentHistorySerializer(serializers.ModelSerializer):
    from_agent_name = serializers.SerializerMethodField()
    to_agent_name   = serializers.SerializerMethodField()

    class Meta:
        model  = UsedLeadAssignmentHistory
        fields = [
            "id", "lead",
            "from_agent", "from_agent_name",
            "to_agent",   "to_agent_name",
            "reason", "changed_by", "changed_at",
        ]

    def get_from_agent_name(self, obj):
        return obj.from_agent.username if obj.from_agent else None

    def get_to_agent_name(self, obj):
        return obj.to_agent.username if obj.to_agent else None


# ─────────────────────────────────────────────────────────────────────────────
# ArchivedLead
# ─────────────────────────────────────────────────────────────────────────────

class ArchivedLeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(
        source="assigned_to.get_full_name", read_only=True
    )
    product_name = serializers.CharField(
        source="product.name", read_only=True
    )

    class Meta:
        model  = ArchivedLead
        fields = "__all__"
        read_only_fields = (
            "archived_by", "archived_at",
            "is_reactivated", "reactivated_by", "reactivated_at",
        )


# ─────────────────────────────────────────────────────────────────────────────
# UploadData / AllocateData / ReallocateAssignedLead
# ─────────────────────────────────────────────────────────────────────────────

class UploadDataSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UploadData
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")


class AllocateDataSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AllocateData
        fields = "__all__"
        read_only_fields = ("id", "created_at")


class ReallocateAssignedLeadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ReallocateAssignedLead
        fields = "__all__"
        read_only_fields = ("id",)

    def validate(self, data):
        if data.get("reassign_to") == "new_user" and not data.get("new_user_name"):
            raise serializers.ValidationError(
                {"new_user_name": "New user name is required when selecting 'Select New User'."}
            )
        return data