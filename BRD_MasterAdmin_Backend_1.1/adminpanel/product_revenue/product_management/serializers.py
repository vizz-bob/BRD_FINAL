from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "product_category",
            "product_type",
            "product_name",
            "product_period_value",
            "product_period_unit",
            "product_amount",
            "is_active",
            "created_at",
        ]
