from django.urls import path
from .views import (
    LoanAccountListAPIView,
    LoanAccountDetailAPIView,
    LoanAccountCreateAPIView,
    LoanAccountUpdateAPIView,
    DisbursementQueueAPIView,
    DisburseLoanAPIView,
)

urlpatterns = [
    path("loan-accounts/", LoanAccountListAPIView.as_view()),
    path("loan-accounts/<int:id>/", LoanAccountDetailAPIView.as_view()),
    path("loan-accounts/create/", LoanAccountCreateAPIView.as_view()),
    path("loan-accounts/<int:id>/update/", LoanAccountUpdateAPIView.as_view()),
    path("disbursement-queue/", DisbursementQueueAPIView.as_view()),
    path("disburse/<int:loan_account_id>/", DisburseLoanAPIView.as_view()),
]
