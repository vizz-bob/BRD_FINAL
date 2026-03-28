from rest_framework import serializers
from .models import LMSLoanAccount

# Serializer for List / Read operations with computed fields

# serializers.py
class LMSLoanAccountListSerializer(serializers.ModelSerializer):
    borrower = serializers.CharField(read_only=True)
    status = serializers.SerializerMethodField()  # keep status computed if needed

    class Meta:
        model = LMSLoanAccount
        fields = [
            'id',
            'borrower',
            'amount',
            'status',            # computed from penny_drop_status / enach_status
            'penny_drop_status',
            'enach_status',
            'action',            # use model field directly
        ]

    def get_status(self, obj):
        if obj.penny_drop_status == 'FAILED' or obj.enach_status == 'FAILED':
            return 'Failed'
        if obj.penny_drop_status == 'PENDING' or obj.enach_status == 'PENDING':
            return 'Pending'
        return 'Active'


# Serializer for Create / Update operations
class LMSLoanAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = LMSLoanAccount
        fields = [
            'borrower',
            'amount',
            'penny_drop_status',
            'enach_status',
        ]
