from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from adminpanel.models import   Role

from .serializers import GroupSerializer
from django.contrib.auth.models import Group
class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

# ACCESS CONTROL
from adminpanel.access_control.models import Role
from adminpanel.access_control.serializers import RoleSerializer


# SERIALIZERS
from .serializers import (
    LoginSerializer,
    RoleSerializer,
    
)

# ================= LOGIN =================
class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        if not user or not user.is_staff:
            return Response({"error": "Unauthorized"}, status=403)

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": "Master Admin",
            },
            status=status.HTTP_200_OK,
        )

class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]


