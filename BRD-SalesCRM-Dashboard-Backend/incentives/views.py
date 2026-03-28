from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date
from .models import Incentive, CommissionStatement
from .serializers import IncentiveSerializer, CommissionStatementSerializer, CurrentCommissionSerializer, PaymentHistorySerializer
from .services import calculate_current_month_commission, payment_history

class IncentiveViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IncentiveSerializer

    def get_queryset(self):
        return Incentive.objects.filter(team_member=self.request.user).order_by('-month')

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        today = date.today()
        first_day = date(today.year, today.month, 1)
        current_month = Incentive.objects.filter(
            team_member=request.user, month=first_day
        ).first()
        ytd = Incentive.objects.filter(
            team_member=request.user,
            month__year=today.year
        ).aggregate(total=Sum('amount'), leads=Sum('disbursed_leads'))

        return Response({
            'current_month': IncentiveSerializer(current_month).data if current_month else None,
            'ytd_total': ytd['total'] or 0,
            'ytd_leads': ytd['leads'] or 0,
        })

    @action(detail=False, methods=["get"])
    def current(self, request):
        data = calculate_current_month_commission(request.user)
        return Response(data)

    @action(detail=False, methods=["get"])
    def history(self, request):
        data = payment_history(request.user)
        return Response(data)

    @action(detail=False, methods=["get"])
    def download_statement(self, request):
        return Response({"message": "Statement download triggered"})