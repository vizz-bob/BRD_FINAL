from rest_framework import viewsets, permissions
from .models import Penalty
from .serializers import PenaltySerializer


class PenaltyViewSet(viewsets.ModelViewSet):
    """
    Penalties Management APIs
    ------------------------
    GET  /api/admin/penalties/
    POST /api/admin/penalties/
    PUT  /api/admin/penalties/{id}/
    """

    queryset = Penalty.objects.all()
    serializer_class = PenaltySerializer
    permission_classes = [permissions.IsAuthenticated]
