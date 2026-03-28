from django.contrib import admin
from .models import ProductMix


@admin.register(ProductMix)
class ProductMixAdmin(admin.ModelAdmin):
    list_display = (
        "product_mix_name",
        "product_category",
        "product_type",
        "product_mix_amount",
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

    search_fields = ("product_mix_name",)
    filter_horizontal = ("products",)
    readonly_fields = ("created_at",)
