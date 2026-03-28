from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Tenant,
    Setting,
    Loan,
    Disbursement,
    ReconciliationTransaction,
    Repayment,
    PaymentRecord,
    Reminder,
    Dashboard,
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )
        return user

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = '__all__'

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = '__all__'

class DisbursementSerializer(serializers.ModelSerializer):
    loan_id = serializers.CharField(source='loan.loan_id', read_only=True, allow_null=True)
    loanId = serializers.SerializerMethodField()
    
    class Meta:
        model = Disbursement
        fields = '__all__'
    
    def get_loanId(self, obj):
        """Return loan_id if loan exists, empty string otherwise"""
        return obj.loan.loan_id if obj.loan else ''

class ReconciliationTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReconciliationTransaction
        fields = '__all__'

class RepaymentSerializer(serializers.ModelSerializer):
    loan_id = serializers.CharField(source='loan.loan_id', read_only=True, allow_null=True)
    
    class Meta:
        model = Repayment
        fields = '__all__'

class PaymentRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentRecord
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'
