from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ActiveLoan
from .serializers import ActiveLoanSerializer


class ActiveLoanListCreateView(APIView):

    def get(self, request):
        loans = ActiveLoan.objects.all().order_by("-created_at")
        serializer = ActiveLoanSerializer(loans, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ActiveLoanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActiveLoanDetailView(APIView):

    def get_object(self, pk):
        try:
            return ActiveLoan.objects.get(pk=pk)
        except ActiveLoan.DoesNotExist:
            return None

    def get(self, request, pk):
        loan = self.get_object(pk)
        if not loan:
            return Response({"error": "Not found"}, status=404)

        serializer = ActiveLoanSerializer(loan)
        return Response(serializer.data)

    def put(self, request, pk):
        loan = self.get_object(pk)
        if not loan:
            return Response({"error": "Not found"}, status=404)

        serializer = ActiveLoanSerializer(loan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        loan = self.get_object(pk)
        if not loan:
            return Response({"error": "Not found"}, status=404)

        loan.delete()
        return Response({"message": "Deleted successfully"}, status=204)