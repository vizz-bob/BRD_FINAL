# los/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoanApplicationViewSet, KYCDetailViewSet, CreditAssessmentViewSet

router = DefaultRouter()
router.register(r'loan-applications', LoanApplicationViewSet, basename='loanapplication')
router.register(r'kyc-details', KYCDetailViewSet, basename='kycdetail')
router.register(r'credit-assessments', CreditAssessmentViewSet, basename='creditassessment')

urlpatterns = [
    path('', include(router.urls)),
]
