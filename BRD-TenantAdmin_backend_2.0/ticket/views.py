# from rest_framework import viewsets, permissions
# from .models import Ticket
# from .serializers import TicketSerializer


# class TicketViewSet(viewsets.ModelViewSet):
#     serializer_class = TicketSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return Ticket.objects.filter(created_by=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(created_by=self.request.user)



from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Ticket
from .serializers import TicketSerializer


class TicketViewSet(ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["status", "priority", "category"]
    ordering_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]
