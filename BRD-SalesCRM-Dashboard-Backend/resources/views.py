from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Resource, ResourceCategory
from .serializers import ResourceSerializer, ResourceCategorySerializer
from .services import increment_download


class ResourceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ResourceCategory.objects.all()
    serializer_class = ResourceCategorySerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        category_type = self.request.query_params.get("type")

        if category_type:
            queryset = queryset.filter(category__type=category_type)

        return queryset

    @action(detail=True, methods=["post"])
    def download(self, request, pk=None):
        resource = self.get_object()
        increment_download(resource)
        return Response({"message": "Download tracked"})