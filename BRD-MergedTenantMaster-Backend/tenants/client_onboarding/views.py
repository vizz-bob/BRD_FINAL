from rest_framework import viewsets, permissions
from .models import Client
from .serializers import ClientSerializer

class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    # Default permission: Sirf logged-in users access kar sakte hain
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Agar user logged in hai, to sirf uska data dikhao
        if self.request.user.is_authenticated:
            return Client.objects.filter(tenant=self.request.user.tenant)
        return Client.objects.none()

    def get_permissions(self):
        """
        Signup (create) ke liye AllowAny permission set karein,
        taaki naya user register ho sake.
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()