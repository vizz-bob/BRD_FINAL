from rest_framework import viewsets, permissions
from .models import ChannelPartner
from .serializers import ChannelPartnerSerializer


class ChannelPartnerViewSet(viewsets.ModelViewSet):
    queryset = ChannelPartner.objects.all()
    serializer_class = ChannelPartnerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
