from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    LoginView,
    RoleViewSet,
    GroupViewSet,
)
from adminpanel.views import RoleViewSet, GroupViewSet
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register("roles", RoleViewSet)
router.register("groups", GroupViewSet)


urlpatterns = [
    path("login/", LoginView.as_view(), name="admin-login"),

    path("product-revenue/", include("adminpanel.product_revenue.product_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.product_mix_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.charges_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.fees_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.interest_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.penalties_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.repayment_management.urls")),
    path("product-revenue/", include("adminpanel.product_revenue.moratorium_management.urls")),
    path("eligibility-score-management/", include("adminpanel.eligibility_score_management.urls")),
    path("bank-funds-management/", include("adminpanel.bank_funds_management.urls")),
    path("agent-management/", include("adminpanel.agent_management.urls")),
    path("access-control/", include("adminpanel.access_control.urls")),
    path("approval-master/", include("adminpanel.approval_master.urls")),
    path("home-dashboard/", include("adminpanel.home_dashboard.urls")),
    path("subscription/", include("adminpanel.subscription_management.urls")),
    path("coupon/", include("adminpanel.coupon_management.urls")),
    path("roles/", include("adminpanel.roles_management.urls")),
  
    path("agent/", include("adminpanel.agent_management.urls")),
    path("currency-management/", include("adminpanel.currency_management.urls")),
    path("concession-management/", include("adminpanel.concession_management.urls")),
    path("collection-management/", include("adminpanel.collection_management.urls")),
    path("profile-management/", include("adminpanel.profile_management.urls")),

    path("organization-management/", include("adminpanel.organization_management.urls")),
    path("eligibility-management/", include("adminpanel.eligibility_score_management.urls")),
]
