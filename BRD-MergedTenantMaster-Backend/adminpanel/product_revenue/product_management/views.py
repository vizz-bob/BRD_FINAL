from rest_framework import viewsets, permissions
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    Product Management APIs
    -----------------------
    GET    /api/v1/adminpanel/product-revenue/products/       → public (AllowAny)
    POST   /api/v1/adminpanel/product-revenue/products/       → authenticated
    GET    /api/v1/adminpanel/product-revenue/products/{id}/  → authenticated
    PUT    /api/v1/adminpanel/product-revenue/products/{id}/  → authenticated
    DELETE /api/v1/adminpanel/product-revenue/products/{id}/  → authenticated
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        # The tenant frontend calls GET /products/ to populate
        # the Loan Type dropdown. Since it runs under a different
        # AUTH_USER_MODEL, we make only the list action public.
        # Every other action (create, retrieve, update, destroy)
        # stays protected behind IsAuthenticated.
        if self.action == "list":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]



# from rest_framework import viewsets, permissions
# from .models import Product
# from .serializers import ProductSerializer


# class ProductViewSet(viewsets.ModelViewSet):
#     """
#     Product Management APIs
#     -----------------------
#     GET  /api/admin/products/
#     POST /api/admin/products/
#     PUT  /api/admin/products/{id}/
#     """

#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [permissions.IsAuthenticated]
