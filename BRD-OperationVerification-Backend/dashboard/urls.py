from rest_framework.routers import DefaultRouter
from .views import PendingTaskViewSet, OperationsDashboardViewSet, SLABreachAlertViewSet

router = DefaultRouter()
router.register(r"tasks", PendingTaskViewSet)
router.register(r"dashboard", OperationsDashboardViewSet, basename="dashboard")
router.register(r"slaalerts", SLABreachAlertViewSet)

urlpatterns = router.urls