from rest_framework.routers import DefaultRouter
from .views import MISReportViewSet, NotificationMasterViewSet

router = DefaultRouter()
router.register("mis-reports", MISReportViewSet)
router.register("notifications", NotificationMasterViewSet)

urlpatterns = router.urls
