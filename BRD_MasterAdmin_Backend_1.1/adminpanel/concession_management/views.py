from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from .permissions import IsMasterAdmin

class ConcessionTypeViewSet(ModelViewSet):
    # permission_classes = [IsMasterAdmin]
    serializer_class = ConcessionTypeSerializer

    def get_queryset(self):
        return ConcessionType.objects.filter(isDeleted=False)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user.email)

    def perform_update(self, serializer):
        serializer.save(modified_user=self.request.user.email)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.isDeleted = True
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ConcessionCategoryViewSet(ModelViewSet):
    # permission_classes = [IsMasterAdmin]
    serializer_class = ConcessionCategorySerializer

    def get_queryset(self):
        return ConcessionCategory.objects.filter(isDeleted=False)

    def perform_create(self, serializer):
        serializer.save(created_user=self.request.user.email)

    def perform_update(self, serializer):
        serializer.save(modified_user=self.request.user.email)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.isDeleted = True
        obj.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
