from django.contrib import admin
from .models import SubscriptionPlan, Subscriber


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = (
        "subscription_name",
        "subscription_amount",
        "subscription_type",
        "status",
        "valid_from",
        "valid_to",
    )
    list_filter = ("status", "subscription_type")
    search_fields = ("subscription_name",)


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = (
        "tenant_id",
        "subscription",
        "subscription_start",
        "subscription_end",
        "status",
    )
    list_filter = ("status",)
