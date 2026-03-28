from rest_framework.routers import DefaultRouter
from .views import (
    ScheduleVerificationViewSet,
    AssignAgentViewSet,
    FieldVerificationViewSet,
    FieldDashboardViewSet,
)

router = DefaultRouter()

router.register(r"schedule-verifications", ScheduleVerificationViewSet)
router.register(r"assign-agents", AssignAgentViewSet)
router.register(r"field-verifications", FieldVerificationViewSet)
router.register(r"field-dashboard", FieldDashboardViewSet)

urlpatterns = router.urls