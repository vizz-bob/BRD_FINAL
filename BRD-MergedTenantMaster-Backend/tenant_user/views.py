from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views import View
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Create a new user"""
        data = request.data.copy()
        
        # Extract password if provided
        password = data.pop('password', None)
        
        # Create user instance
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Set password if provided
        if password:
            user.set_password(password)
            user.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Update user details"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        # Extract and handle password separately
        password = data.pop('password', None)
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Update password if provided and not empty
        if password:
            instance.set_password(password)
            instance.save()

        return Response(serializer.data)


class LoginView(View):
    def get(self, request):
        return render(request, 'user/login.html')
    
    def post(self, request):
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid email or password')
        
        return render(request, 'user/login.html')


class LogoutView(View):
    def get(self, request):
        logout(request)
        messages.success(request, 'Logged out successfully!')
        return redirect('login')
    
    def post(self, request):
        logout(request)
        messages.success(request, 'Logged out successfully!')
        return redirect('login')


def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            messages.success(request, 'Login successful!')
            return redirect('home')
        else:
            messages.error(request, 'Invalid email or password')
    
    return render(request, 'user/login.html')


def logout_view(request):
    logout(request)
    messages.success(request, 'Logged out successfully!')
    return redirect('login')
