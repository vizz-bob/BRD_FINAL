from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Dashboard, NewTenant, ShowTenant
from .serializers import DashboardSerializer, NewTenantSerializer, ShowTenantSerializer

# Dashboard
class DashboardListCreateView(ListCreateAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer

class DashboardDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer

# Add Tenant
class TenantListCreateView(ListCreateAPIView):
    queryset = NewTenant.objects.all()
    serializer_class = NewTenantSerializer

class TenantDetailView(RetrieveUpdateDestroyAPIView):
    queryset = NewTenant.objects.all()
    serializer_class = NewTenantSerializer

# Show Tenant
class ShowTenantListCreateView(ListCreateAPIView):
    queryset = ShowTenant.objects.all()
    serializer_class = ShowTenantSerializer

class ShowTenantDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ShowTenant.objects.all()
    serializer_class = ShowTenantSerializer