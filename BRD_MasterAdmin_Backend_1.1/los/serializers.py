# los/serializers.py
from rest_framework import serializers
from .models import LoanApplication, KYCDetail, CreditAssessment

class KYCDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCDetail
        fields = ['id', 'loan_application', 'kyc_type', 'document_number', 'document_file', 'status', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class CreditAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditAssessment
        fields = ['id', 'application', 'score', 'remarks', 'status', 'approved_limit', 'assessed_at']
        read_only_fields = ['id', 'assessed_at']

class LoanApplicationSerializer(serializers.ModelSerializer):
    # nested serializers for detail views
    kyc_details = KYCDetailSerializer(many=True, read_only=True)
    credit_assessment = CreditAssessmentSerializer(read_only=True)

    class Meta:
        model = LoanApplication
        fields = [
            'id', 'application_id', 'tenant', 'branch', 'customer',
            'amount', 'tenure_months', 'interest_rate', 'status',
            'created_by', 'created_at', 'updated_at',
            'kyc_details', 'credit_assessment'
        ]
        read_only_fields = ['id', 'application_id', 'created_at', 'updated_at', 'created_by', 'kyc_details', 'credit_assessment']

    def create(self, validated_data):
        # set created_by if available in context
        request = self.context.get('request', None)
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        return super().create(validated_data)
