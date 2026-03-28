from django.contrib import admin
from .models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = (
        "coupon_code",
        "promotion_name",
        "coupon_value",
        "usage_status",
        "status",
        "valid_from",
        "valid_to",
    )
    list_filter = ("status", "usage_status")
    search_fields = ("coupon_code", "promotion_name")
    filter_horizontal = ("subscriptions",)
