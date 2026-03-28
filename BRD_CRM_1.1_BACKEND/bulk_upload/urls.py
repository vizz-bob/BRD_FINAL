from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import (
    FileUploadViewSet,
    ManualEntryViewSet,
    FtpIntegrationViewSet,
    ApiIntegrationViewSet,
)

router = DefaultRouter()
router.register(r"file-uploads", FileUploadViewSet, basename="file-upload")
router.register(r"manual-entries", ManualEntryViewSet, basename="manual-entry")
router.register(r"ftp-integrations", FtpIntegrationViewSet, basename="ftp-integration")
router.register(r"api-integrations", ApiIntegrationViewSet, basename="api-integration")

urlpatterns = [
    path("", include(router.urls)),
]
