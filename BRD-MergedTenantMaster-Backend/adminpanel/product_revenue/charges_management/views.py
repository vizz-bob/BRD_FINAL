from rest_framework import viewsets, permissions
from .models import Charge
from .serializers import ChargeSerializer


class ChargeViewSet(viewsets.ModelViewSet):
    """
    Charges Management APIs
    ----------------------
    GET  /api/admin/charges/
    POST /api/admin/charges/
    PUT  /api/admin/charges/{id}/
    """

    queryset = Charge.objects.all()
    serializer_class = ChargeSerializer
    permission_classes = [permissions.IsAuthenticated]
