# lms/serializers.py
from rest_framework import serializers
from .models import LoanAccount, Repayment, Collection
from los.serializers import LoanApplicationSerializer  # optional nested representation if needed

class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = ['id', 'loan_account', 'amount', 'paid_at', 'transaction_reference']
        read_only_fields = ['id', 'paid_at', 'transaction_reference']

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'loan_account', 'collector', 'amount', 'collected_at']
        read_only_fields = ['id', 'collected_at']

class LoanAccountSerializer(serializers.ModelSerializer):
    repayments = RepaymentSerializer(many=True, read_only=True)
    collections = CollectionSerializer(many=True, read_only=True)

    class Meta:
        model = LoanAccount
        fields = [
            'id', 'loan_application', 'account_id', 'emi_amount', 'interest_rate',
            'outstanding_principal', 'disbursed_at', 'tenor_months', 'repayments', 'collections'
        ]
        read_only_fields = ['id', 'disbursed_at', 'outstanding_principal']
