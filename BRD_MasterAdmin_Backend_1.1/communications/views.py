from rest_framework import viewsets
from .models import Communication
from .serializers import CommunicationSerializer
from users.permissions import DefaultPermission

class CommunicationViewSet(viewsets.ModelViewSet):
    queryset = Communication.objects.all().order_by('-created_at')
    serializer_class = CommunicationSerializer
    permission_classes = [DefaultPermission]
