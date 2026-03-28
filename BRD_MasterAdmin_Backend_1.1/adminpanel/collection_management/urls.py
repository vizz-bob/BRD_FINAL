from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("payment-gateways", PaymentGatewayViewSet)
router.register("collection-controls", CollectionControlViewSet)
router.register("client-team-mapping", ClientTeamMappingViewSet)
router.register("client-agent-mapping", ClientAgentMappingViewSet)
router.register("payout-management", PayoutManagementViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
