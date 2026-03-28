from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SanctionDocumentViewSet,
    LoanDocumentViewSet,
    CollateralDocumentViewSet
)

router = DefaultRouter()
router.register("sanction-documents", SanctionDocumentViewSet)
router.register("loan-documents", LoanDocumentViewSet)
router.register("collateral-documents", CollateralDocumentViewSet)

urlpatterns = [
    path("api/v1/documents/", include(router.urls)),
]
