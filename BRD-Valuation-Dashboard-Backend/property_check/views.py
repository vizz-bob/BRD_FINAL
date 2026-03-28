#--------------------------
# New property check
#---------------------------
from rest_framework import generics
from .models import PropertyCheck
from .serializers import PropertyCheckSerializer


class PropertyCheckCreateListView(generics.ListCreateAPIView):
    queryset = PropertyCheck.objects.all()
    serializer_class = PropertyCheckSerializer


class PropertyCheckDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PropertyCheck.objects.all()
    serializer_class = PropertyCheckSerializer
#----------------------------------
# Property Check Dashbaord
#----------------------------------
from rest_framework import generics
from .models import PropertyDashboard
from .serializers import PropertyDashboardSerializer


# List + Create Dashboard Record
class PropertyDashboardListCreateView(generics.ListCreateAPIView):
    queryset = PropertyDashboard.objects.all().order_by("-updated_at")
    serializer_class = PropertyDashboardSerializer


# Retrieve + Update Dashboard Record
class PropertyDashboardDetailView(generics.RetrieveUpdateAPIView):
    queryset = PropertyDashboard.objects.all()
    serializer_class = PropertyDashboardSerializer