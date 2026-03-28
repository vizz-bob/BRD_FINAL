from rest_framework import viewsets

from .serializers import TenantUserSerializer
from .models import TenantUser

class TenantUserViewSet(viewsets.ModelViewSet):
    queryset = TenantUser.objects.all()
    serializer_class = TenantUserSerializer