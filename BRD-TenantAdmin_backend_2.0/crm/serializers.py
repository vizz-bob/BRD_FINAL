from rest_framework import serializers
from .models import Lead, Customer, LeadActivity, Business
from tenants.models import TenantLoanProduct

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")

class LeadActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadActivity
        fields = "__all__"
        read_only_fields = ("created_at",)

class BusinessSerializer(serializers.ModelSerializer):
    # Expects a list of IDs for writing
    mapped_products = serializers.PrimaryKeyRelatedField(
        queryset=TenantLoanProduct.objects.all(), 
        many=True, 
        required=False
    )
    # Read-only field to show names in responses
    mapped_products_details = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = [
            'id', 'uuid', 'name', 'cin', 'pan', 'gstin', 'address', 
            'mapped_products', 'mapped_products_details',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ("created_at", "updated_at", "created_by")

    def get_mapped_products_details(self, obj):
        return [{"id": p.id, "name": p.name} for p in obj.mapped_products.all()]