#---------------------------------
# update agent
#--------------------------------
from rest_framework import generics
from .models import UpdateAgent
from .serializers import UpdateAgentSerializer

class UpdateAgentListCreateView(generics.ListCreateAPIView):
    queryset = UpdateAgent.objects.all()
    serializer_class = UpdateAgentSerializer


class UpdateAgentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UpdateAgent.objects.all()
    serializer_class = UpdateAgentSerializer
#------------------------------
# Identity Documents
#-------------------------------
from .models import AgentKYC
from .serializers import AgentKYCSerializer
from rest_framework import generics

class AgentKYCListCreateView(generics.ListCreateAPIView):
    queryset = AgentKYC.objects.all()
    serializer_class = AgentKYCSerializer


class AgentKYCDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AgentKYC.objects.all()
    serializer_class = AgentKYCSerializer
#---------------------------
# Address
#----------------------------
from rest_framework import generics
from .models import Address
from .serializers import AddressSerializer


class AddressListCreateView(generics.ListCreateAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
#--------------------------
# Setting
#---------------------------
from .models import Setting
from .serializers import SettingSerializer
from rest_framework import generics


class SettingListCreateView(generics.ListCreateAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer


class SettingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer