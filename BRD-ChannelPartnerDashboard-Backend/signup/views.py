from django.shortcuts import render

# Create your views here.

from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Create_Account
from .serializers import CreateAccountSerializer

class CreateAccountListCreateView(ListCreateAPIView):
    queryset = Create_Account.objects.all()
    serializer_class = CreateAccountSerializer

class CreateAccountDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Create_Account.objects.all()
    serializer_class = CreateAccountSerializer
