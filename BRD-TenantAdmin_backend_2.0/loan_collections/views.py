from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Delinquency
from .serializers import (
    DelinquencyListSerializer,
    DelinquencyDetailSerializer,
    DelinquencyCreateUpdateSerializer,
)


# ==========================================
# 1. List All Delinquencies
# GET /api/v1/loan-collections/
# ==========================================
class DelinquencyListAPIView(ListAPIView):
    queryset = Delinquency.objects.select_related("loan_account")
    serializer_class = DelinquencyListSerializer


# ==========================================
# 2. Retrieve Single Delinquency
# GET /api/v1/loan-collections/<id>/
# ==========================================
class DelinquencyDetailAPIView(RetrieveAPIView):
    queryset = Delinquency.objects.select_related("loan_account")
    serializer_class = DelinquencyDetailSerializer
    lookup_field = "id"


# ==========================================
# 3. Create Delinquency
# POST /api/v1/loan-collections/
# ==========================================
class DelinquencyCreateAPIView(CreateAPIView):
    queryset = Delinquency.objects.all()
    serializer_class = DelinquencyCreateUpdateSerializer


# ==========================================
# 4. Update Delinquency
# PUT/PATCH /api/v1/loan-collections/<id>/
# ==========================================
class DelinquencyUpdateAPIView(UpdateAPIView):
    queryset = Delinquency.objects.all()
    serializer_class = DelinquencyCreateUpdateSerializer
    lookup_field = "id"


# ==========================================
# 5. Delete Delinquency
# DELETE /api/v1/loan-collections/<id>/
# ==========================================
class DelinquencyDeleteAPIView(DestroyAPIView):
    queryset = Delinquency.objects.all()
    lookup_field = "id"


# ==========================================
# 6. Overdue Loans API
# GET /api/v1/loan-collections/overdue-loans/
# ==========================================
class OverdueLoansAPIView(ListAPIView):
    serializer_class = DelinquencyListSerializer

    def get_queryset(self):
        return Delinquency.objects.select_related(
            "loan_account"
        ).filter(dpd__gt=0)


# ==========================================
# 7. Collection Stats API
# GET /api/v1/loan-collections/stats/
# ==========================================
class CollectionStatsAPIView(APIView):

    def get(self, request):
        queryset = Delinquency.objects.all()

        total_accounts = queryset.count()
        total_overdue = queryset.aggregate(
            total=Sum("overdue_amount")
        )["total"] or 0

        bucket_summary = queryset.values("bucket").annotate(
            count=Count("id")
        )

        return Response({
            "total_accounts": total_accounts,
            "total_overdue_amount": total_overdue,
            "bucket_summary": bucket_summary,
        }, status=status.HTTP_200_OK)
