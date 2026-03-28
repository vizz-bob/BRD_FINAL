from django.shortcuts import render

# Create your views here.

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Sign_in
from .serializers import SignInSerializer

class SignInListCreateView(ListCreateAPIView):
    queryset = Sign_in.objects.all()
    serializer_class = SignInSerializer

class SignInDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Sign_in.objects.all()
    serializer_class = SignInSerializer
