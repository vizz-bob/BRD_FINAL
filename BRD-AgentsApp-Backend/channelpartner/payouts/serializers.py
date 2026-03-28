from rest_framework import serializers
from .models import Payout
from channelpartner.leads.models import Lead
from channelpartner.accounts.models import User

class PayoutSerializer(serializers.ModelSerializer):
    lead_details = serializers.SerializerMethodField()
    partner_name = serializers.CharField(source='partner.username', read_only=True)
    
    class Meta:
        model = Payout
        fields = [
            'id', 'payout_id', 'lead', 'lead_details', 'partner', 'partner_name',
            'commission_percentage', 'disbursed_amount', 'commission_amount',
            'status', 'transaction_id', 'paid_at', 'created_at', 'invoice'
        ]
        read_only_fields = ['payout_id', 'commission_amount', 'created_at', 'paid_at']
    
    def get_lead_details(self, obj):
        if obj.lead:
            return {
                "id": obj.lead.id,
                "name": obj.lead.name,
                "lead_id": obj.lead.lead_id,
                "product_type": obj.lead.product_type,
                "amount": str(obj.lead.amount),
                "created_at": obj.lead.created_at,
                "status": obj.lead.status
            }
        return None

class PayoutDetailSerializer(serializers.ModelSerializer):
    lead_details = serializers.SerializerMethodField()
    partner_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Payout
        fields = '__all__'
    
    def get_lead_details(self, obj):
        if obj.lead:
            return {
                "id": obj.lead.id,
                "lead_id": obj.lead.lead_id,
                "name": obj.lead.name,
                "mobile": obj.lead.mobile,
                "email": obj.lead.email,
                "product_type": obj.lead.product_type,
                "amount": str(obj.lead.amount),
                "status": obj.lead.status,
                "created_at": obj.lead.created_at
            }
        return None
    
    def get_partner_details(self, obj):
        if obj.partner:
            return {
                "id": obj.partner.id,
                "username": obj.partner.username,
                "phone": obj.partner.phone,
                "bank_account": obj.partner.bank_account,
                "ifsc_code": obj.partner.ifsc_code
            }
        return None
