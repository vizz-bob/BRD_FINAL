from django.urls import path
from .views import ActiveLoanListCreateView, ActiveLoanDetailView

urlpatterns = [
    path("active-loans/", ActiveLoanListCreateView.as_view(), name="active-loans"),
    path("active-loans/<int:pk>/", ActiveLoanDetailView.as_view(), name="active-loan-detail"),
]