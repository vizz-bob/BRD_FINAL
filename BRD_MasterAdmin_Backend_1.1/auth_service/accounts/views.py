# from django.contrib.auth import authenticate
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import LoginSerializer


# class LoginView(APIView):
#     authentication_classes = []
#     permission_classes = []

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = serializer.validated_data["email"]
#         password = serializer.validated_data["password"]

#         user = authenticate(
#             request=request,      # 🔴 REQUIRED BY AXES
#             username=email,       # 🔴 MUST BE username
#             password=password
#         )

#         if not user or not user.is_master_admin:
#             return Response(
#                 {"error": "Invalid master admin credentials"},
#                 status=401
#             )

#         refresh = RefreshToken.for_user(user)

#         return Response({
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#             "role": "MASTER_ADMIN"
#         })
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer


from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from brd_platform.permissions import IsAdminOrMaster


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer
from adminpanel.access_control.models import UserRole


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(
            request=request,   # required for django-axes
            username=email,
            password=password
        )

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # 🔐 RBAC AUTHORIZATION (replace is_staff)
        has_active_role = UserRole.objects.filter(
            user=user,
            role__is_active=True
        ).exists()

        if not has_active_role:
            return Response(
                {"error": "Unauthorized. No active role assigned."},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        # 🟢 ROLES & PERMISSIONS FROM RBAC
        roles = user.get_roles()                # ['admin', 'manager']
        permissions = user.get_permissions()    # ['dashboard.view', 'users.create']

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "roles": roles,
            "permissions": permissions
        }, status=status.HTTP_200_OK)



from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import MeSerializer

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = MeSerializer(request.user)
        return Response(serializer.data)
