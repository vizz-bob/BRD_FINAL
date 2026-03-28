from rest_framework import serializers
from .models import SubscriptionPlan, Subscriber


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = "__all__"


class SubscriberSerializer(serializers.ModelSerializer):
    subscription_name = serializers.CharField(
        source="subscription.subscription_name", read_only=True
    )

    class Meta:
        model = Subscriber
        fields = "__all__"
