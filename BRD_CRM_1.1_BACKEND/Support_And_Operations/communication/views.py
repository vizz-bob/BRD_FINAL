# communication/views.py

from rest_framework import viewsets, permissions
from .models import Communication
from .serializers import CommunicationSerializer
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

class CommunicationViewSet(viewsets.ModelViewSet):
    queryset = Communication.objects.all().order_by('-timestamp')
    serializer_class = CommunicationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['conversation_type', 'lead_id', 'mode', 'direction', 'status']

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)
