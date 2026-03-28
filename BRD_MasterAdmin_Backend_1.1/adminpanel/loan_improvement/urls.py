from django.urls import path
from .views import (
    LoanImprovementCreateAPIView,
    LoanImprovementListAPIView,
)

urlpatterns = [
    path("loan-improvements/", LoanImprovementListAPIView.as_view()),
    path("loan-improvements/create/", LoanImprovementCreateAPIView.as_view()),
]
