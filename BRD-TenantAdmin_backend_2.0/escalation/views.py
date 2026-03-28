from rest_framework import viewsets, permissions
from .models import EscalationRule
from .serializers import EscalationRuleSerializer


class EscalationRuleViewSet(viewsets.ModelViewSet):
    queryset = EscalationRule.objects.all()
    serializer_class = EscalationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
