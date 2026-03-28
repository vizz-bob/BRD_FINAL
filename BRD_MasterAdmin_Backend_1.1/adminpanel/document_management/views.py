from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from .permissions import IsMasterAdmin

class SanctionDocumentViewSet(ModelViewSet):
    permission_classes = [IsMasterAdmin]
    serializer_class = SanctionDocumentSerializer

    def get_queryset(self):
        return SanctionDocument.objects.filter(isDeleted=False)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(modified_user=self.request.user.username)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.isDeleted = True
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LoanDocumentViewSet(ModelViewSet):
    permission_classes = [IsMasterAdmin]
    serializer_class = LoanDocumentSerializer

    def get_queryset(self):
        return LoanDocument.objects.filter(isDeleted=False)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(modified_user=self.request.user.username)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.isDeleted = True
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CollateralDocumentViewSet(ModelViewSet):
    permission_classes = [IsMasterAdmin]
    serializer_class = CollateralDocumentSerializer

    def get_queryset(self):
        return CollateralDocument.objects.filter(isDeleted=False)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(modified_user=self.request.user.username)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.isDeleted = True
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
