from rest_framework import serializers
from .models import HotLead, Lead, Stage, IntentActivity
from django.utils import timezone

class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = "__all__"

class LeadSerializer(serializers.ModelSerializer):
    sla_breach = serializers.SerializerMethodField()
    stage_name = serializers.CharField(source="stage.name", read_only=True)

    class Meta:
        model = Lead
        fields = "__all__"

    def get_sla_breach(self, obj):
        return obj.is_sla_breach()

class IntentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = IntentActivity
        fields = ['activity_type', 'note', 'created_at']

class HotLeadSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField(source='lead.name', required=False)
    phone = serializers.CharField(source='lead.phone', required=False)
    eligibilityStatus = serializers.SerializerMethodField()
    intentScore = serializers.CharField(source='lead.intent_percentage', required=False) # Changed to Char to allow % suffix handling if needed, or just let DRF handle int
    vendorSource = serializers.CharField(source='lead.lead_source', required=False)
    docs = serializers.SerializerMethodField()
    slaStatus = serializers.SerializerMethodField()
    lastAct = serializers.SerializerMethodField()
    activities = IntentActivitySerializer(many=True, read_only=True)
    
    # Kanban-specific fields
    intent = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    stagnant = serializers.SerializerMethodField()

    # LOS Profile fields
    losStage = serializers.CharField(source='lead.los_stage', required=False)
    losDescription = serializers.CharField(source='lead.los_description', required=False)
    losStatus = serializers.CharField(source='lead.los_status', required=False)

    class Meta:
        model = HotLead
        fields = [
            'pk', 'id', 'name', 'phone', 'eligibilityStatus', 'intentScore', 
            'vendorSource', 'docs', 'slaStatus', 'lastAct', 'activities',
            'intent', 'age', 'stagnant', 'losStage', 'losDescription', 'losStatus'
        ]

    def update(self, instance, validated_data):
        lead_data = validated_data.pop('lead', {})
        lead = instance.lead
        
        # Manually update lead fields
        for attr, value in lead_data.items():
            if attr == 'intent_percentage' and isinstance(value, str):
                value = value.replace('%', '').strip()
                try:
                    value = int(value)
                except ValueError:
                    continue # or set to 0
            setattr(lead, attr, value)
        lead.save()
        
        return super().update(instance, validated_data)


    def get_id(self, obj):
        return f"HOT-{obj.lead.id}"

    def get_eligibilityStatus(self, obj):

        # Frontend values: 'hot', 'breach', 'docpending', 'avgintent'
        mapping = {
            "HOT": "hot",
            "SLA_BREACH": "breach",
            "DOCS_PENDING": "docpending",
            "AVG_INTENT": "avgintent"
        }
        return mapping.get(obj.tag_status, "hot")

    def get_intentScore(self, obj):
        return f"{obj.lead.intent_percentage}%"
    
    def get_intent(self, obj):
        return f"{obj.lead.intent_percentage}%"

    def get_docs(self, obj):
        return "Completed" if obj.lead.docs_completed else "Pending"

    def get_slaStatus(self, obj):
        if obj.lead.is_sla_breach():
            return "Breach"
        days_passed = (timezone.now() - obj.lead.created_at).days
        if days_passed >= obj.lead.sla_days - 1:
            return "Warning"
        return "Good"
    
    def get_stagnant(self, obj):
        return obj.lead.is_sla_breach()

    def get_lastAct(self, obj):
        diff = timezone.now() - obj.updated_at
        if diff.days > 0:
            return f"{diff.days}d ago"
        hours = diff.seconds // 3600
        if hours > 0:
            return f"{hours}h ago"
        minutes = (diff.seconds // 60) % 60
        return f"{minutes}m ago"

    def get_age(self, obj):
        return self.get_lastAct(obj)



