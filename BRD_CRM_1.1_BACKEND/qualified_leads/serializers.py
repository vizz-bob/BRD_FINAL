from rest_framework import serializers
from .models import QualifiedLead, DocumentCollection, Eligibility, ContactLead
from django.utils import timezone

class DocumentCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCollection
        fields = "__all__"

class EligibilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Eligibility
        fields = ['document_score', 'income_score', 'credit_score', 'property_score', 'overall_percentage', 'status']

class ContactLeadSerializer(serializers.ModelSerializer):
    interestArea = serializers.CharField(source='interest_area', required=False)
    loanAmount = serializers.DecimalField(source='expected_loan_amount', max_digits=12, decimal_places=2, required=False)
    nextAction = serializers.CharField(source='next_action', required=False)
    qualificationNotes = serializers.CharField(source='qualification_notes', required=False)
    
    class Meta:
        model = ContactLead
        fields = [
            'id', 'lead_name', 'phone_number', 'email', 'city', 'status', 
            'created_at', 'interestArea', 'loanAmount', 'nextAction', 'qualificationNotes'
        ]

class QualifiedLeadSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='lead_id', required=False)
    name = serializers.CharField(required=False)
    phone = serializers.CharField(source='phone_number', required=False)
    email = serializers.EmailField(required=False)
    interestArea = serializers.CharField(source='interest', required=False, allow_null=True, allow_blank=True)
    eligibilityStatus = serializers.CharField(source='status', required=False)
    documentsCollected = serializers.SerializerMethodField()
    nextFollowUp = serializers.DateField(source='next_follow_up', required=False, allow_null=True)
    assignedAgent = serializers.SerializerMethodField()
    leadScore = serializers.IntegerField(source='score', required=False)
    lastContact = serializers.SerializerMethodField()
    priority = serializers.CharField(required=False)
    loanAmount = serializers.DecimalField(source='loan_amount', max_digits=12, decimal_places=2, required=False, allow_null=True)
    nextAction = serializers.CharField(source='next_action', required=False, allow_null=True, allow_blank=True)
    qualificationNotes = serializers.CharField(source='qualification_notes', required=False, allow_null=True, allow_blank=True)
    city = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    
    # Relationships
    eligibility = EligibilitySerializer(read_only=True)
    contacts = ContactLeadSerializer(many=True, read_only=True)

    class Meta:
        model = QualifiedLead
        fields = [
            'pk', 'id', 'name', 'phone', 'email', 'interestArea', 
            'eligibilityStatus', 'documentsCollected', 'nextFollowUp', 
            'assignedAgent', 'leadScore', 'lastContact', 'priority',
            'loanAmount', 'nextAction', 'qualificationNotes', 'city',
            'eligibility', 'contacts'
        ]

    # Removed get_email since it's now a model field
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if 'interestArea' in ret and ret['interestArea']:
            ret['interestArea'] = ret['interestArea'].replace('_', '-')
        
        if 'eligibilityStatus' in ret and ret['eligibilityStatus']:
            mapping = {
                "ELIGIBLE": "eligible",
                "DOCUMENTS_PENDING": "pending-docs",
                "UNDER_REVIEW": "under-review",
                "INELIGIBLE": "ineligible"
            }
            ret['eligibilityStatus'] = mapping.get(ret['eligibilityStatus'], ret['eligibilityStatus'].lower().replace('_', '-'))
        
        if 'nextAction' in ret and ret['nextAction']:
            ret['nextAction'] = ret['nextAction'].replace('_', '-')
            
        return ret

    def to_internal_value(self, data):
        # Create a mutable copy of data
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = data.copy() if isinstance(data, dict) else data

        # 1. Map frontend choice values to backend format (before blank/NA check)
        if 'interestArea' in data and data['interestArea'] and isinstance(data['interestArea'], str):
            data['interestArea'] = data['interestArea'].lower().replace('-', '_')
        
        if 'eligibilityStatus' in data and data['eligibilityStatus']:
            status_map = {
                "eligible": "ELIGIBLE",
                "pending-docs": "DOCUMENTS_PENDING",
                "under-review": "UNDER_REVIEW",
                "ineligible": "INELIGIBLE"
            }
            val = data['eligibilityStatus'].lower()
            data['eligibilityStatus'] = status_map.get(val, val.upper().replace('-', '_'))
        
        if 'nextAction' in data and data['nextAction'] and isinstance(data['nextAction'], str):
            data['nextAction'] = data['nextAction'].lower().replace('-', '_')

        # 2. Handle 'N/A' and empty strings from frontend for all fields
        # This prevents validation errors for Date and Decimal fields
        for field in list(data.keys()):
            if data[field] == "N/A" or data[field] == "":
                data[field] = None

        # 3. Strip read-only or computed fields that might be sent back in the bulk formData
        # DRF can sometimes complain if these aren't explicitly marked read_only in all contexts
        read_only_to_strip = [
            'documentsCollected', 'assignedAgent', 'lastContact', 
            'leadScore', 'pk', 'id', 'eligibility', 'contacts'
        ]
        for field in read_only_to_strip:
            if field in data:
                data.pop(field)

        return super().to_internal_value(data)

    def get_documentsCollected(self, obj):
        try:
            docs = obj.documents.first()
            if not docs:
                return []
            collected = []
            if docs.pan_card: collected.append('pan')
            if docs.aadhar_card: collected.append('aadhar')
            if docs.salary_slips: collected.append('salary-slip')
            if docs.bank_statement: collected.append('bank-statement')
            if docs.employment_proof: collected.append('employment-proof')
            if docs.address_proof: collected.append('address-proof')
            return collected
        except:
            return []

    def get_assignedAgent(self, obj):
        if obj.pipeline_lead and obj.pipeline_lead.assigned_to:
            return obj.pipeline_lead.assigned_to.username
        return "N/A"

    def get_lastContact(self, obj):
        return obj.updated_at.strftime("%Y-%m-%d")
