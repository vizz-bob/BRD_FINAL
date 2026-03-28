from rest_framework.routers import DefaultRouter
from .views import (
    NewValuationRequestViewSet,
    GenerateNewReportViewSet,
    LocationDistributionViewSet,
    ValuationViewSet,
    ValuationDashboardViewSet,
)

router = DefaultRouter()

router.register(r"new-valuation-requests", NewValuationRequestViewSet)
router.register(r"generate-reports", GenerateNewReportViewSet)
router.register(r"location-distribution", LocationDistributionViewSet)
router.register(r"valuations", ValuationViewSet)

# Dashboard (manual route because ViewSet not ModelViewSet)
from django.urls import path
from .views import ValuationDashboardViewSet

urlpatterns = router.urls + [
    path("valuation-dashboard/", ValuationDashboardViewSet.as_view({"get": "list"})),
]