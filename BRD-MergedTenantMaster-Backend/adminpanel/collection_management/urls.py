from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("payment-gateways", PaymentGatewayViewSet)
router.register("collection-controls", CollectionControlViewSet)
router.register("client-team-mapping", ClientTeamMappingViewSet)
router.register("client-agent-mapping", ClientAgentMappingViewSet)
router.register("payout-management", PayoutManagementViewSet)
router.register("overdue-loans", OverdueLoanViewSet)

urlpatterns = [
    path("stats/", get_collection_stats, name="get_collection_stats"),
    path("overdue-loans/", get_overdue_loans, name="get_overdue_loans"),
    path("record-action/<str:loan_id>/", record_action, name="record_action"),
    path("", include(router.urls)),
]
