from rest_framework import serializers
from .models import ProductMix
from adminpanel.product_revenue.product_management.models import Product


class ProductMixSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Product.objects.all()
    )

    class Meta:
        model = ProductMix
        fields = [
            "id",
            "product_category",
            "product_type",
            "product_mix_name",
            "product_mix_amount",
            "product_period_value",
            "product_period_unit",
            "products",
            "is_active",
            "created_at",
        ]
        read_only_fields = ("created_at",)
