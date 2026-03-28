from rest_framework import viewsets, permissions
from .models import Moratorium
from .serializers import MoratoriumSerializer


class MoratoriumViewSet(viewsets.ModelViewSet):
    """
    Moratorium Management APIs
    --------------------------
    GET  /api/admin/moratoriums/
    POST /api/admin/moratoriums/
    PUT  /api/admin/moratoriums/{id}/
    """

    queryset = Moratorium.objects.all()
    serializer_class = MoratoriumSerializer
    permission_classes = [permissions.IsAuthenticated]
