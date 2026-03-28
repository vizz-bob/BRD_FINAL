#---------------------------
# Payout Dashbaord
#---------------------------
from rest_framework import generics
from .models import Payout_Dashboard
from .serializers import PayoutDashboardSerializer

class PayoutDashboardListCreateView(generics.ListCreateAPIView):
    queryset = Payout_Dashboard.objects.all()
    serializer_class = PayoutDashboardSerializer


class PayoutDashboardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payout_Dashboard.objects.all()
    serializer_class = PayoutDashboardSerializer
#-----------------------
# Search
#-----------------------
from rest_framework import generics, filters
from .models import Payout_Search
from .serializers import PayoutSearchSerializer

class PayoutSearchListCreateView(generics.ListCreateAPIView):
    queryset = Payout_Search.objects.all()
    serializer_class = PayoutSearchSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["search", "type"]


class PayoutSearchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payout_Search.objects.all()
    serializer_class = PayoutSearchSerializer
#------------------------------
# payout updated
#-----------------------------
from rest_framework import generics
from .models import Payout_Agent
from .serializers import PayoutAgentSerializer

class PayoutAgentListCreateView(generics.ListCreateAPIView):
    queryset = Payout_Agent.objects.all()
    serializer_class = PayoutAgentSerializer


class PayoutAgentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payout_Agent.objects.all()
    serializer_class = PayoutAgentSerializer