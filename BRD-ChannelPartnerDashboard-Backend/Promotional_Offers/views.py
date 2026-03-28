#---------------------------
# New Offer Details
#---------------------------
from rest_framework import generics
from .models import New_Offer_Details
from .serializers import NewOfferDetailsSerializer


# List + Create API
class NewOfferListCreateView(generics.ListCreateAPIView):
    queryset = New_Offer_Details.objects.all().order_by('-created_at')
    serializer_class = NewOfferDetailsSerializer


# Retrieve + Update + Delete API
class NewOfferDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = New_Offer_Details.objects.all()
    serializer_class = NewOfferDetailsSerializer
#-----------------------
# New Target
#------------------------
from rest_framework import generics
from .models import New_Targetting
from .serializers import NewTargettingSerializer


class NewTargettingListCreateView(generics.ListCreateAPIView):
    queryset = New_Targetting.objects.all().order_by('-created_at')
    serializer_class = NewTargettingSerializer


class NewTargettingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = New_Targetting.objects.all()
    serializer_class = NewTargettingSerializer
#-----------------------
# dashboard
#-----------------------
from rest_framework import generics
from .models import Dashboard
from .serializers import DashboardSerializer


# List + Create
class DashboardListCreateView(generics.ListCreateAPIView):
    queryset = Dashboard.objects.all().order_by('-created_at')
    serializer_class = DashboardSerializer


# Retrieve + Update + Delete
class DashboardDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Dashboard.objects.all()
    serializer_class = DashboardSerializer