from django.urls import path
from .views import LMSLoanAccountListCreateView, LMSLoanAccountRetrieveUpdateDestroyView

urlpatterns = [
    path('lms-loan-accounts/', LMSLoanAccountListCreateView.as_view(), name='lmsloanaccount-list-create'),
    path('lms-loan-accounts/<int:pk>/', LMSLoanAccountRetrieveUpdateDestroyView.as_view(), name='lmsloanaccount-detail'),
]
