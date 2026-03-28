from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("loan-classification", LoanClassificationViewSet)
router.register("writeoff-rules", WriteOffRuleViewSet)
router.register("settlement-rules", SettlementRuleViewSet)
router.register("provisioning-npa", ProvisioningNPAViewSet)
router.register("incentive-management", IncentiveManagementViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
