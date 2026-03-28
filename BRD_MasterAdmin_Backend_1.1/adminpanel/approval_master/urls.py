from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApprovalMasterViewSet, ApprovalAssignmentViewSet, EscalationMasterViewSet

router = DefaultRouter()
router.register("approval-list", ApprovalMasterViewSet)
router.register("manage-approval", ApprovalAssignmentViewSet)
router.register("escalation-master", EscalationMasterViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
