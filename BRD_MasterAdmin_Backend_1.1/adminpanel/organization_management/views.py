from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Organization, Branch
from .serializers import OrganizationSerializer, BranchSerializer
from .permissions import IsMasterAdmin


# =========================
# ORGANIZATION APIs
# =========================
class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all().order_by("-created_at")
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated, IsMasterAdmin]


# =========================
# BRANCH APIs
# =========================
class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.select_related("organization").all().order_by("-created_at")
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated, IsMasterAdmin]
