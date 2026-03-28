from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Avg, Count
from django.utils.timezone import now

from .models import (
    NewValuationRequest,
    GenerateNewReport,
    ValuationDashboard,
    LocationDistribution,
    Valuation,
)

from .serializers import (
    NewValuationRequestSerializer,
    GenerateNewReportSerializer,
    ValuationDashboardSerializer,
    LocationDistributionSerializer,
    ValuationSerializer,
)


# ----------------------------
# New Valuation Request
# ----------------------------
class NewValuationRequestViewSet(viewsets.ModelViewSet):
    queryset = NewValuationRequest.objects.all().order_by("-created_at")
    serializer_class = NewValuationRequestSerializer


# ----------------------------
# Generate New Report
# ----------------------------
class GenerateNewReportViewSet(viewsets.ModelViewSet):
    queryset = GenerateNewReport.objects.all().order_by("-created_at")
    serializer_class = GenerateNewReportSerializer


# ----------------------------
# Location Distribution
# ----------------------------
class LocationDistributionViewSet(viewsets.ModelViewSet):
    queryset = LocationDistribution.objects.all().order_by("-created_at")
    serializer_class = LocationDistributionSerializer


# ----------------------------
# Valuation
# ----------------------------
class ValuationViewSet(viewsets.ModelViewSet):
    queryset = Valuation.objects.all().order_by("-created_at")
    serializer_class = ValuationSerializer


# ----------------------------
# Valuation Dashboard (Auto Calculated)
# ----------------------------
class ValuationDashboardViewSet(viewsets.ViewSet):

    def list(self, request):
        today = now().date()

        pending = Valuation.objects.filter(status="pending").count()
        completed_today = Valuation.objects.filter(
            status="completed",
            valuation_date=today
        ).count()

        average_value = Valuation.objects.aggregate(
            Avg("estimated_value")
        )["estimated_value__avg"] or 0

        total = Valuation.objects.count()
        completed = Valuation.objects.filter(status="completed").count()

        success_rate = (completed / total * 100) if total > 0 else 0

        data = {
            "pending_valuations": pending,
            "completed_today": completed_today,
            "average_value": round(average_value, 2),
            "success_rate": round(success_rate, 2),
        }

        return Response(data)