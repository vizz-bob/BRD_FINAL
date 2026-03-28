from rest_framework import viewsets, permissions
from .models import KnowledgeResource
from .serializers import KnowledgeResourceSerializer

class KnowledgeResourceViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeResource.objects.all()
    serializer_class = KnowledgeResourceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return KnowledgeResource.objects.all()
        if hasattr(user, 'tenant'):
            return self.queryset.filter(tenant=user.tenant)
        return self.queryset.none()
