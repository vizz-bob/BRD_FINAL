from django.contrib import admin
from .models import Moratorium


@admin.register(Moratorium)
class MoratoriumAdmin(admin.ModelAdmin):
    list_display = (
        "moratorium_type",
        "period_value",
        "period_unit",
        "amount",
        "effect_of_moratorium",
        "interest_rationalisation",
        "is_active",
        "created_at",
    )

    list_filter = (
        "moratorium_type",
        "period_unit",
        "effect_of_moratorium",
        "interest_rationalisation",
        "is_active",
    )

    readonly_fields = ("created_at",)
