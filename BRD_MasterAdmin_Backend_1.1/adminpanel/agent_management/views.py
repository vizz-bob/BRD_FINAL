from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from .models import *
from .serializers import *


class BaseAgentView(ModelViewSet):
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class ChannelPartnerViewSet(BaseAgentView):
    queryset = ChannelPartner.objects.filter(is_deleted=False)
    serializer_class = ChannelPartnerSerializer


class VerificationAgencyViewSet(BaseAgentView):
    queryset = VerificationAgency.objects.filter(is_deleted=False)
    serializer_class = VerificationAgencySerializer


class CollectionAgentViewSet(BaseAgentView):
    queryset = CollectionAgent.objects.filter(is_deleted=False)
    serializer_class = CollectionAgentSerializer
