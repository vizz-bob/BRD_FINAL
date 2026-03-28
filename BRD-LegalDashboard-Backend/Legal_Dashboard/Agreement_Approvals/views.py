from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Agreement
from .Serializers import AgreementSerializer


# 1️⃣ Agreements Table
class AgreementListView(APIView):

    def get(self, request):

        agreements = Agreement.objects.all()
        serializer = AgreementSerializer(agreements, many=True)

        return Response(serializer.data)


# 1️⃣ B Get/Update/Delete Single Agreement
class AgreementDetailView(APIView):

    def get(self, request, pk):
        """Get a single agreement by ID"""
        try:
            agreement = Agreement.objects.get(id=pk)
            serializer = AgreementSerializer(agreement)
            return Response(serializer.data)
        except Agreement.DoesNotExist:
            return Response({"error": "Agreement not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        """Update an entire agreement"""
        try:
            agreement = Agreement.objects.get(id=pk)
            serializer = AgreementSerializer(agreement, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Agreement updated successfully", "data": serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Agreement.DoesNotExist:
            return Response({"error": "Agreement not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        """Partially update an agreement"""
        try:
            agreement = Agreement.objects.get(id=pk)
            serializer = AgreementSerializer(agreement, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Agreement updated successfully", "data": serializer.data})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Agreement.DoesNotExist:
            return Response({"error": "Agreement not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        """Delete an agreement"""
        try:
            agreement = Agreement.objects.get(id=pk)
            agreement.delete()
            return Response({"message": "Agreement deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Agreement.DoesNotExist:
            return Response({"error": "Agreement not found"}, status=status.HTTP_404_NOT_FOUND)


# 2️⃣ Dashboard Numbers
class DashboardStatsView(APIView):

    def get(self, request):

        total = Agreement.objects.count()
        pending = Agreement.objects.filter(status="Pending").count()
        approved = Agreement.objects.filter(status="Approved").count()
        high_priority = Agreement.objects.filter(priority="High").count()

        data = {
            "total_agreements": total,
            "pending_review": pending,
            "approved": approved,
            "high_priority": high_priority
        }

        return Response(data)


# 3️⃣ New Agreement
class CreateAgreementView(APIView):

    def post(self, request):

        serializer = AgreementSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Agreement created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 4️⃣ Bulk Assign
class BulkAssignView(APIView):

    def post(self, request):

        agreements = request.data.get("agreements")
        assignee = request.data.get("assigned_to")

        if not agreements or not assignee:
            return Response({"error": "Missing agreements or assigned_to field"}, status=status.HTTP_400_BAD_REQUEST)

        Agreement.objects.filter(
            id__in=agreements
        ).update(assigned_to=assignee)

        return Response({"message": "Bulk assignment successful"}, status=status.HTTP_200_OK)