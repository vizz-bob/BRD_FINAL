from rest_framework.viewsets import ModelViewSet
from .models import VendorProfile, AgentProfile, ClientProfile
from .serializers import (
    VendorProfileSerializer,
    AgentProfileSerializer,
    ClientProfileSerializer,
)


class VendorProfileViewSet(ModelViewSet):
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer


class AgentProfileViewSet(ModelViewSet):
    queryset = AgentProfile.objects.all()
    serializer_class = AgentProfileSerializer


class ClientProfileViewSet(ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer
