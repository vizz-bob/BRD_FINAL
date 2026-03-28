from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.utils import timezone

from .models import SubscriptionPlan, UserSubscription
from .serializers import (
    SubscriptionPlanSerializer,
    UserSubscriptionSerializer,
)


# ----------------------------
# List Available Plans
# ----------------------------
class SubscriptionPlanListView(generics.ListAPIView):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]


# ----------------------------
# Purchase Subscription
# ----------------------------
class PurchaseSubscriptionView(generics.CreateAPIView):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        plan_id = request.data.get("plan")

        if not plan_id:
            return Response(
                {"error": "Plan is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response(
                {"error": "Invalid or inactive plan"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Optional: prevent multiple active subscriptions
        active_subscription = UserSubscription.objects.filter(
            user=request.user,
            is_active=True,
            end_date__gte=timezone.now()
        ).first()

        if active_subscription:
            return Response(
                {"error": "You already have an active subscription"},
                status=status.HTTP_400_BAD_REQUEST
            )

        subscription = UserSubscription.objects.create(
            user=request.user,
            plan=plan,
            activation_date=timezone.now()
        )

        serializer = self.get_serializer(subscription)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ----------------------------
# My Subscription (Current Active)
# ----------------------------
class MySubscriptionView(generics.ListAPIView):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSubscription.objects.filter(
            user=self.request.user
        ).order_by("-purchase_date")
