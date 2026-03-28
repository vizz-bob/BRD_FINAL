from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import LoanImprovementRequest
from .serializers import LoanImprovementRequestSerializer
from .permissions import IsLoanImprovementMaker, IsLoanImprovementViewer


class LoanImprovementCreateAPIView(APIView):
    permission_classes = [IsLoanImprovementMaker]

    def post(self, request):
        serializer = LoanImprovementRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(requested_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoanImprovementListAPIView(APIView):
    permission_classes = [IsLoanImprovementViewer]

    def get(self, request):
        qs = LoanImprovementRequest.objects.all()
        serializer = LoanImprovementRequestSerializer(qs, many=True)
        return Response(serializer.data)
