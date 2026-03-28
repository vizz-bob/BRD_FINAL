from rest_framework import viewsets, permissions
from .models import InterestConfiguration
from .serializers import InterestConfigurationSerializer


class InterestConfigurationViewSet(viewsets.ModelViewSet):
    """
    Interest Management APIs
    -----------------------
    GET  /api/admin/interest/
    POST /api/admin/interest/
    PUT  /api/admin/interest/{id}/
    """

    queryset = InterestConfiguration.objects.all()
    serializer_class = InterestConfigurationSerializer
    permission_classes = [permissions.IsAuthenticated]
