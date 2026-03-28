from rest_framework import generics
from .models import LMSLoanAccount
from .serializers import LMSLoanAccountListSerializer, LMSLoanAccountSerializer

# List all LMSLoanAccounts (with computed fields)
class LMSLoanAccountListCreateView(generics.ListCreateAPIView):
    queryset = LMSLoanAccount.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LMSLoanAccountSerializer  # For Create
        return LMSLoanAccountListSerializer   # For List


# Retrieve / Update / Delete a specific LMSLoanAccount
class LMSLoanAccountRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LMSLoanAccount.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return LMSLoanAccountSerializer  # For Update
        return LMSLoanAccountListSerializer   # For Read
