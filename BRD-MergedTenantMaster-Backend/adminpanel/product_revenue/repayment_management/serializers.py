from rest_framework import serializers
from .models import RepaymentConfiguration


class RepaymentConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepaymentConfiguration
        fields = [
            "id",
            "repayment_type",
            "frequency",
            "limit_in_month",
            "gap_between_disbursement_and_first_repayment",
            "number_of_repayments",
            "sequence_of_repayment_adjustment",
            "repayment_months",
            "repayment_days",
            "repayment_dates",
            "mode_of_collection",
            "is_active",
            "created_at",
        ]
    
    def validate(self, attrs):
        print(f"DEBUG: RepaymentConfigurationSerializer validate called with: {attrs}")
        
        # Validate required fields
        required_fields = [
            'repayment_type', 'frequency', 'limit_in_month', 
            'gap_between_disbursement_and_first_repayment', 'number_of_repayments',
            'sequence_of_repayment_adjustment', 'mode_of_collection', 'is_active'
        ]
        
        for field in required_fields:
            if field not in attrs or not attrs[field]:
                raise serializers.ValidationError(f"{field.replace('_', ' ').title()} is required")
        
        # Validate JSON fields must be lists
        list_fields = ['repayment_months', 'repayment_days', 'repayment_dates']
        for field in list_fields:
            if field in attrs and not isinstance(attrs[field], list):
                raise serializers.ValidationError(f"{field.replace('_', ' ').title()} must be a list")
        
        # Validate choice fields
        choice_fields = {
            'repayment_type': ['EMI', 'BULLET', 'STEP_UP'],
            'frequency': ['MONTHLY', 'BI_WEEKLY'],
            'sequence_of_repayment_adjustment': ['PRINCIPAL_FIRST', 'INTEREST_FIRST'],
            'mode_of_collection': ['NACH', 'CASH', 'ONLINE']
        }
        
        for field, valid_choices in choice_fields.items():
            if field in attrs and attrs[field] not in valid_choices:
                raise serializers.ValidationError(f"Invalid {field.replace('_', ' ').title()}. Valid choices are: {', '.join(valid_choices)}")
        
        # Validate numeric fields
        numeric_fields = ['limit_in_month', 'gap_between_disbursement_and_first_repayment', 'number_of_repayments']
        for field in numeric_fields:
            if field in attrs:
                try:
                    value = int(attrs[field])
                    if value <= 0:
                        raise serializers.ValidationError(f"{field.replace('_', ' ').title()} must be greater than 0")
                except (ValueError, TypeError):
                    raise serializers.ValidationError(f"{field.replace('_', ' ').title()} must be a valid positive integer")
        
        return attrs
