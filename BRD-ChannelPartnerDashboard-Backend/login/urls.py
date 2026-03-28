# login/urls.py
from django.urls import path
from .views import SignInListCreateView, SignInDetailView

urlpatterns = [
    # Sign In
    path('sign-in/', SignInListCreateView.as_view(), name='sign-in-list-create'),
    path('sign-in/<int:pk>/', SignInDetailView.as_view(), name='sign-in-detail'),
]
