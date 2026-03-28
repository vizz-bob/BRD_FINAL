from django.urls import path
from .views import (
    SubscriptionPlanListView,
    PurchaseSubscriptionView,
    MySubscriptionView,
)

urlpatterns = [
    path("plans/", SubscriptionPlanListView.as_view(), name="subscription-plans"),
    path("purchase/", PurchaseSubscriptionView.as_view(), name="purchase-subscription"),
    path("my/", MySubscriptionView.as_view(), name="my-subscription"),
]
