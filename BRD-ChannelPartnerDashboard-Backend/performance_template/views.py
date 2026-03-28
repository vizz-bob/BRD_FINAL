#-------------------------
# Dashboard
#-------------------------
from rest_framework import generics
from .models import Dashboard
from .serializers import DashboardSerializer
class DashboardListCreateView(generics.ListCreateAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
class DashboardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer
#---------------------
# New Template
#----------------------
from rest_framework import generics
from .models import NewTemplate
from .serializers import NewTemplateSerializer


class TemplateListCreateView(generics.ListCreateAPIView):
    queryset = NewTemplate.objects.all()
    serializer_class = NewTemplateSerializer


class TemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NewTemplate.objects.all()
    serializer_class = NewTemplateSerializer