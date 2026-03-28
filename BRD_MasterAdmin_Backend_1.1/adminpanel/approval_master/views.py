from rest_framework.viewsets import ModelViewSet

from .models import ApprovalMaster
from .serializers import ApprovalMasterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from brd_platform.permissions import IsMasterAdmin


class ApprovalMasterViewSet(ModelViewSet):
    queryset = ApprovalMaster.objects.all()
    serializer_class = ApprovalMasterSerializer
    permission_classes = [IsAuthenticated, IsMasterAdmin]

    def get(self, request):
        return Response({"message": "Only master admin can see this"})


from rest_framework import viewsets
from .models import ApprovalAssignment, EscalationMaster
from .serializers import (
    ApprovalAssignmentSerializer,
    EscalationMasterSerializer,
)


# class ApprovalAssignmentViewSet(viewsets.ModelViewSet):
#     queryset = ApprovalAssignment.objects.all()
#     serializer_class = ApprovalAssignmentSerializer

class ApprovalAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ApprovalAssignment.objects.all()
    serializer_class = ApprovalAssignmentSerializer
    permission_classes = [IsAuthenticated]



class EscalationMasterViewSet(viewsets.ModelViewSet):
    queryset = EscalationMaster.objects.all()
    serializer_class = EscalationMasterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        return super().create(request, *args, **kwargs)


