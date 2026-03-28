# lms/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoanAccountViewSet, RepaymentViewSet, CollectionViewSet

router = DefaultRouter()
router.register(r'loan-accounts', LoanAccountViewSet, basename='loanaccount')
router.register(r'repayments', RepaymentViewSet, basename='repayment')
router.register(r'collections', CollectionViewSet, basename='collection')

urlpatterns = [
    path('', include(router.urls)),
]
