from rest_framework import viewsets, permissions
from .models import ProductMix
from .serializers import ProductMixSerializer


class ProductMixViewSet(viewsets.ModelViewSet):
    """
    Product Mix Management APIs
    ---------------------------
    GET  /api/admin/product-mixes/
    POST /api/admin/product-mixes/
    PUT  /api/admin/product-mixes/{id}/
    """

    queryset = ProductMix.objects.all()
    serializer_class = ProductMixSerializer
    permission_classes = [permissions.IsAuthenticated]
