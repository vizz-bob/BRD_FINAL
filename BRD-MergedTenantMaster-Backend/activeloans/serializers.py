from rest_framework import serializers
from .models import ActiveLoan

class ActiveLoanSerializer(serializers.ModelSerializer):
    loan_account_number = serializers.CharField(source="loan_account")
    product_name = serializers.CharField(source="product_type")
    current_outstanding = serializers.DecimalField(
        source="outstanding", max_digits=12, decimal_places=2
    )
    next_emi_date = serializers.DateField(source="next_emi")

    class Meta:
        model = ActiveLoan
        fields = [
            "loan_account",
            "loan_account_number",
            "product_name",
            "disbursed_amount",
            "current_outstanding",
            "next_emi_date",
            "status",
        ]