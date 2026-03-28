# dashboard/views.py
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Dashboard, RecentAgent
from .serializers import (
    DashboardSerializer, RecentAgentSerializer,
)

class DashboardListCreateView(ListCreateAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer

class DashboardDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer

class RecentAgentListCreateView(ListCreateAPIView):
    queryset = RecentAgent.objects.all()
    serializer_class = RecentAgentSerializer

class RecentAgentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RecentAgent.objects.all()
    serializer_class = RecentAgentSerializer