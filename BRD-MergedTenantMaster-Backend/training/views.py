from rest_framework import viewsets, permissions
from .models import TrainingModule
from .serializers import TrainingModuleSerializer

class TrainingModuleViewSet(viewsets.ModelViewSet):
    queryset = TrainingModule.objects.all()
    serializer_class = TrainingModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return TrainingModule.objects.all()
        if hasattr(user, 'tenant'):
            return self.queryset.filter(tenant=user.tenant)
        return self.queryset.none()
