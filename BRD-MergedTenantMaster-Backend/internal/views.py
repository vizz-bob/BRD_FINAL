from rest_framework import generics, permissions
from .models import (
    InternalDashboard,
    InternalRole,
    InternalUserRole
)
from .serializers import (
    InternalDashboardSerializer,
    InternalRoleSerializer
)


# ----------------------------
# List Dashboards (Cards UI)
# ----------------------------
class DashboardListView(generics.ListAPIView):
    queryset = InternalDashboard.objects.filter(is_active=True)
    serializer_class = InternalDashboardSerializer
    permission_classes = [permissions.IsAuthenticated]


# ----------------------------
# User Accessible Dashboards
# ----------------------------
class MyDashboardsView(generics.ListAPIView):
    serializer_class = InternalDashboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        roles = InternalUserRole.objects.filter(
            user=self.request.user
        ).values_list("role", flat=True)

        return InternalDashboard.objects.filter(
            internalrole__id__in=roles,
            is_active=True
        ).distinct()


# ----------------------------
# User Roles
# ----------------------------
class MyRolesView(generics.ListAPIView):
    serializer_class = InternalRoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InternalRole.objects.filter(
            internaluserrole__user=self.request.user,
            is_active=True
        )
