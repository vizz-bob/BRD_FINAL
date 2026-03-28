from rest_framework import viewsets, permissions
from .models import RepaymentConfiguration
from .serializers import RepaymentConfigurationSerializer


class RepaymentConfigurationViewSet(viewsets.ModelViewSet):
    """
    Repayment Management APIs
    -------------------------
    GET  /api/admin/repayments/
    POST /api/admin/repayments/
    PUT  /api/admin/repayments/{id}/
    """

    queryset = RepaymentConfiguration.objects.all()
    serializer_class = RepaymentConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]
