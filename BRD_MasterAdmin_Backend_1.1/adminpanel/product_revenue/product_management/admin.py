from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "product_category",
        "product_type",
        "product_amount",
        "product_period_value",
        "product_period_unit",
        "is_active",
        "created_at",
    )

    list_filter = (
        "product_category",
        "product_type",
        "product_period_unit",
        "is_active",
    )

    search_fields = (
        "product_name",
        "product_category",
        "product_type",
    )

    readonly_fields = ("created_at",)
