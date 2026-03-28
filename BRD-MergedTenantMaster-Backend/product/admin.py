from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "loan_type",
        "min_amount",
        "max_amount",
        "min_tenure",
        "max_tenure",
        "created_at",
    )
    search_fields = ("product_name",)
    list_filter = ("loan_type",)
