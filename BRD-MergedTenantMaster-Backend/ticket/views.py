from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'tenant'):
            serializer.save(tenant=self.request.user.tenant)
        else:
            serializer.save()
