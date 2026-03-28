# signup/urls.py
from django.urls import path
from .views import CreateAccountListCreateView, CreateAccountDetailView

urlpatterns = [
    # Accounts
    path('accounts/', CreateAccountListCreateView.as_view(), name='account-list-create'),
    path('accounts/<int:pk>/', CreateAccountDetailView.as_view(), name='account-detail'),
]
