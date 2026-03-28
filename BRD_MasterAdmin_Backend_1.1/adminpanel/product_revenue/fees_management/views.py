from rest_framework import viewsets, permissions
from .models import Fee
from .serializers import FeeSerializer


class FeeViewSet(viewsets.ModelViewSet):
    """
    Fees Management APIs
    --------------------
    GET  /api/admin/fees/
    POST /api/admin/fees/
    PUT  /api/admin/fees/{id}/
    """

    queryset = Fee.objects.all()
    serializer_class = FeeSerializer
    permission_classes = [permissions.IsAuthenticated]
