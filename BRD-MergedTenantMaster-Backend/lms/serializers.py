# lms/serializers.py

from rest_framework import serializers
from .models import LoanAccount, Repayment, Collection


class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = '__all__'
        read_only_fields = ('paid_at',)


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = '__all__'
        read_only_fields = ('collected_at',)


class LoanAccountSerializer(serializers.ModelSerializer):
    repayments = RepaymentSerializer(many=True, read_only=True)
    collections = CollectionSerializer(many=True, read_only=True)

    class Meta:
        model = LoanAccount
        fields = '__all__'
        read_only_fields = ('account_id', 'created_at')