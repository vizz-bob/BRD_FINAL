from rest_framework import serializers
from .models import SubscriptionPlan, UserSubscription


# ----------------------------
# Subscription Plan Serializer
# ----------------------------
class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "price",
            "duration_days",
            "is_active",
            "created_at",
        ]


# ----------------------------
# User Subscription Serializer
# ----------------------------
class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            "id",
            "plan",
            "purchase_date",
            "activation_date",
            "end_date",
            "no_of_borrowers",
            "no_of_users",
            "is_active",
        ]
        read_only_fields = (
            "purchase_date",
            "activation_date",
            "end_date",
            "is_active",
        )
