from django.db import transaction

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    LoanApplication,
    CreditAssessment,
    PropertyDetail,
)

from .serializers import (
    LoanApplicationSerializer,
    CreditAssessmentSerializer,
    PropertyDetailSerializer,
)

from .logic.rule_engine import RuleEngine


# ============================================================
# LOAN APPLICATION VIEWSET
# ============================================================
class LoanApplicationViewSet(viewsets.ModelViewSet):

    queryset = LoanApplication.objects.all()
    serializer_class = LoanApplicationSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "income_type",
        "employment_type",
        "created_at",
    ]

    search_fields = [
        "application_number",
        "first_name",
        "last_name",
        "mobile_no",
        "pan",
    ]

    ordering_fields = ["created_at", "requested_amount"]
    ordering = ["-created_at"]

    # --------------------------------------------------------
    # AUTO-ASSIGN CREATED_BY
    # --------------------------------------------------------
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # --------------------------------------------------------
    # RUN CREDIT ASSESSMENT (RULE ENGINE)
    # --------------------------------------------------------
    @action(detail=True, methods=["post"], url_path="run-credit")
    def run_credit(self, request, pk=None):

        application = self.get_object()

        engine = RuleEngine(application)

        with transaction.atomic():

            result = engine.evaluate()

            credit, _ = CreditAssessment.objects.get_or_create(
                application=application
            )

            credit.status = (
                "SYSTEM_APPROVED"
                if result.get("decision") == "APPROVE"
                else "SYSTEM_REJECTED"
            )

            credit.remarks = result.get("reason", "System evaluation")
            credit.save(update_fields=["status", "remarks"])

        return Response(
            {
                "message": "Credit evaluation completed",
                "result": result,
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# CREDIT ASSESSMENT (READ ONLY)
# ============================================================
class CreditAssessmentViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = CreditAssessment.objects.select_related("application")
    serializer_class = CreditAssessmentSerializer
    permission_classes = [IsAuthenticated]


# ============================================================
# PROPERTY DETAIL VIEWSET
# ============================================================
class PropertyDetailViewSet(viewsets.ModelViewSet):

    queryset = PropertyDetail.objects.select_related("loan_application")
    serializer_class = PropertyDetailSerializer
    permission_classes = [IsAuthenticated]

    filterset_fields = ["property_type", "city", "state"]
