from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Channel, ChannelAnalytics
from .serializers import ChannelSerializer, ChannelAnalyticsSerializer
from .access import IsAdminOrMarketing
from rest_framework.permissions import AllowAny
# ---------------------------
# Channel CRUD + Enable/Disable
# ---------------------------

class ChannelViewSet(viewsets.ModelViewSet):
    queryset = Channel.objects.all().order_by('-created_at')
    serializer_class = ChannelSerializer
    permission_classes = [AllowAny]


    # Save created_by and create related ChannelAnalytics
    def perform_create(self, serializer):
        channel = serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)
        ChannelAnalytics.objects.create(channel=channel)

    # Disable a channel
    @action(detail=True, methods=['post'])
    def disable(self, request, pk=None):
        channel = self.get_object()
        channel.is_active = False
        channel.save()
        return Response({'status': 'Channel disabled'})

    # Enable a channel
    @action(detail=True, methods=['post'])
    def enable(self, request, pk=None):
        channel = self.get_object()
        channel.is_active = True
        channel.save()
        return Response({'status': 'Channel enabled'})


# ---------------------------
# Channel Analytics Read-Only
# ---------------------------

class ChannelAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChannelAnalytics.objects.select_related('channel')
    serializer_class = ChannelAnalyticsSerializer


# ---------------------------
# Channel Dashboard (Aggregated)
# ---------------------------

class ChannelDashboardViewSet(viewsets.ViewSet):

    def list(self, request):
        data = []
        for analytics in ChannelAnalytics.objects.select_related('channel'):
            data.append({
                'channel': analytics.channel.channel_name,
                'type': analytics.channel.channel_type,
                'leads': analytics.total_leads,
                'conversion_rate': analytics.conversion_rate,
                'cpl': analytics.cpl,
                'roi': analytics.roi,
                'status': analytics.channel.is_active
            })
        return Response(data)
