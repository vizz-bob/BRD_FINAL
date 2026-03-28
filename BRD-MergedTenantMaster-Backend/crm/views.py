from rest_framework import viewsets, permissions
from .models import Lead, Customer, LeadActivity
from .serializers import LeadSerializer, CustomerSerializer, LeadActivitySerializer

class LeadViewSet(viewsets.ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, "tenant", None)
        if tenant:
            return Lead.objects.filter(tenant=tenant).order_by('-created_at')
        return Lead.objects.none()

    def perform_create(self, serializer):
        tenant = getattr(self.request, "tenant", None)
        serializer.save(tenant=tenant)

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, "tenant", None)
        if tenant:
            return Customer.objects.filter(tenant=tenant).order_by('-created_at')
        return Customer.objects.none()

    def perform_create(self, serializer):
        tenant = getattr(self.request, "tenant", None)
        serializer.save(tenant=tenant)

class LeadActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeadActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, "tenant", None)
        if tenant:
            return LeadActivity.objects.filter(lead__tenant=tenant).order_by('-created_at')
        return LeadActivity.objects.none()
