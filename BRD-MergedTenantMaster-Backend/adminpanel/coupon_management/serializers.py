from rest_framework import serializers
from .models import Coupon


class CouponSerializer(serializers.ModelSerializer):
    subscription_names = serializers.SerializerMethodField()

    class Meta:
        model = Coupon
        fields = "__all__"

    def get_subscription_names(self, obj):
        return [sub.subscription_name for sub in obj.subscriptions.all()]
