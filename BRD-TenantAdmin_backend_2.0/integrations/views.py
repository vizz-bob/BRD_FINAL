from rest_framework import viewsets, permissions
from .models import APIIntegration, WebhookLog
from .serializers import APIIntegrationSerializer, WebhookLogSerializer

class APIIntegrationViewSet(viewsets.ModelViewSet):
    serializer_class = APIIntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, "tenant", None)
        if tenant:
            return APIIntegration.objects.filter(tenant=tenant)
        return APIIntegration.objects.none()

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, "tenant", None))

class WebhookLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WebhookLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, "tenant", None)
        if tenant:
            return WebhookLog.objects.filter(tenant=tenant)
        return WebhookLog.objects.none()
