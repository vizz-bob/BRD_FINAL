from rest_framework import serializers
from .models import Lead, LeadStatus, IntentActivity

class IntentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = IntentActivity
        fields = ["activity_type", "note", "created_at"]


class LeadSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    intentScore = serializers.IntegerField(source="score")
    docs = serializers.CharField(source="docs_status")
    
    # Aliases for frontend
    intent = serializers.IntegerField(source="score", read_only=True)
    lastAct = serializers.SerializerMethodField()
    slaStatus = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    activities = IntentActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = [
            "id", "pk", "name", "phone", "status", "intentScore", "intent", 
            "docs", "lastAct", "slaStatus", "age", "updated_at", "score",
            "los_stage", "los_status", "los_description", "vendor_source",
            "losStage", "losStatus", "losDescription", "vendorSource",
            "activities"
        ]

    # Handle camelCase for frontend
    pk = serializers.IntegerField(source="id", read_only=True)
    losStage = serializers.CharField(source="los_stage", allow_null=True, required=False)
    losStatus = serializers.CharField(source="los_status", allow_null=True, required=False)
    losDescription = serializers.CharField(source="los_description", allow_null=True, required=False)
    vendorSource = serializers.CharField(source="vendor_source", allow_null=True, required=False)

    def get_lastAct(self, obj):
        # Calculate time since last update
        from django.utils import timezone
        diff = timezone.now() - obj.updated_at
        if diff.days > 0:
            return f"{diff.days}D AGO"
        hours = diff.seconds // 3600
        if hours > 0:
            return f"{hours}H AGO"
        minutes = (diff.seconds % 3600) // 60
        return f"{minutes}M AGO"

    def get_slaStatus(self, obj):
        if obj.status == LeadStatus.SLA_BREACH or obj.is_sla_breach():
            return "Breach"
        return "Normal"

    def get_age(self, obj):
        from django.utils import timezone
        diff = timezone.now() - obj.created_at
        return f"{diff.days}D"

    def get_name(self, obj):
        try:
            return obj.pipeline_lead.lead.name
        except AttributeError:
            return "Unknown Lead"

    def get_phone(self, obj):
        try:
            return obj.pipeline_lead.lead.phone
        except AttributeError:
            return "N/A"
