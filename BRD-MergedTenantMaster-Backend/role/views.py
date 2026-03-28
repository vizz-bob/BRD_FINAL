from rest_framework import viewsets, filters
from .models import Role
from .serializers import RoleSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all().order_by("-created_at")
    serializer_class = RoleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["role_name", "description"]
