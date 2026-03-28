from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import OrganizationDetails,ChangePassword,Signin,Signup
from .serializers import OrganizationDetailsSerializer,ChangePasswordSerializer
from .serializers import SigninSerializer,SignupSerializer
#-------------------------
# Edit Profile
#---------------------------
class OrganizationDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        obj, created = OrganizationDetails.objects.get_or_create(
            user=request.user
        )
        serializer = OrganizationDetailsSerializer(obj)
        return Response(serializer.data)
    def put(self, request):
        obj, created = OrganizationDetails.objects.get_or_create(
            user=request.user
        )
        serializer = OrganizationDetailsSerializer(
            obj,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            if request.data.get("change_password"):
                new_password = request.data.get("new_password")
                if new_password:
                    request.user.set_password(new_password)
                    request.user.save()
            return Response(
                {"message": "Profile updated successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#--------------------------
# Change Password
#--------------------------
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            current_password = serializer.validated_data["current_password"]
            new_password = serializer.validated_data["new_password"]
            cancel = serializer.validated_data["cancel"]
            update_password = serializer.validated_data["update_password"]
            if cancel:
                return Response(
                    {"message": "Password change cancelled"},
                    status=status.HTTP_200_OK
                )
            user = request.user
            if not user.check_password(current_password):
                return Response(
                    {"error": "Current password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if update_password:
                user.set_password(new_password)
                user.save()
                ChangePassword.objects.create(
                    user=user,
                    current_password=current_password,
                    new_password=new_password,
                    confirm_new_password=new_password,
                    cancel=False,
                    update_password=True
                )
                return Response(
                    {"message": "Password updated successfully"},
                    status=status.HTTP_200_OK
                )
            return Response(
                {"message": "Update password checkbox not selected"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#--------------------------
# Sign in
#-----------------------------
class SigninView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")
        remember_me = request.data.get("remember_me", False)
        forgot_password = request.data.get("forgot_password", False)

        # Forgot Password Checkbox
        if forgot_password:
            return Response(
                {"message": "Redirect to forgot password page"},
                status=status.HTTP_200_OK
            )

        # Authenticate User
        user = authenticate(username=email, password=password)

        if user is not None:

            # Save login record
            Signin.objects.create(
                email=email,
                password=password,
                remember_me=remember_me,
                forgot_password=False
            )

            return Response(
                {"message": "Login successful"},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST
        )
#---------------------------
# Sign up
#----------------------------
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            full_name = serializer.validated_data["full_name"]
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]
            sign_up = serializer.validated_data["sign_up"]
            if not sign_up:
                return Response(
                    {"message": "Signup checkbox not selected"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if User.objects.filter(username=email).exists():
                return Response(
                    {"error": "User already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=full_name
            )
            serializer.save()
            return Response(
                {"message": "Signup successful"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)