from django.contrib import admin
from .models import Currency

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = (
        "currency_code",
        "currency_symbol",
        "conversion_value_to_inr",
        "status",
        "created_at",
    )
    list_filter = ("status",)
