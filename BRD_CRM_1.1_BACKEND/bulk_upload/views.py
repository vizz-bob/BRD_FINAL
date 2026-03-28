from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from data_ingestion.models import RawLeadPool

from .models import FileUpload, ManualEntry, FtpIntegration, ApiIntegration
from .serializers import (
    FileUploadSerializer,
    ManualEntrySerializer,
    FtpIntegrationSerializer,
    ApiIntegrationSerializer,
)

from django.db import transaction
from django.utils import timezone

# ---------------------------
# File Upload ViewSet
# ---------------------------

class FileUploadViewSet(viewsets.ModelViewSet):
    queryset = FileUpload.objects.all().order_by("-id")
    serializer_class = FileUploadSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]


# ---------------------------
# Manual Entry ViewSet
# ---------------------------

class ManualEntryViewSet(viewsets.ModelViewSet):
    queryset = ManualEntry.objects.all().order_by("-id")
    serializer_class = ManualEntrySerializer
    permission_classes = [AllowAny]

    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Creates ManualEntry and automatically inserts into RawLeadPool.
        Optional duplicate check based on mobile/email.
        """

        mobile = request.data.get("mobile_number")
        email = request.data.get("email")

        if mobile and ManualEntry.objects.filter(mobile_number=mobile).exists():
            return Response(
                {"error": "Duplicate mobile number found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if email and ManualEntry.objects.filter(email=email).exists():
            return Response(
                {"error": "Duplicate email found."},
                status=status.HTTP_400_BAD_REQUEST,
            )


        response = super().create(request, *args, **kwargs)

        # just for testing so that pipeline stages gets data from here
        manual_entry = ManualEntry.objects.get(id=response.data["id"])
        RawLeadPool.objects.create(
            lead=manual_entry,
            name=manual_entry.name,
            phone_number=manual_entry.mobile_number,
            email=manual_entry.email,
            source="manual_entry",
            validation_status="incomplete",
            ingested_at=timezone.now().date(),
        )

        return response


# ---------------------------
# FTP Integration ViewSet
# ---------------------------

class FtpIntegrationViewSet(viewsets.ModelViewSet):
    queryset = FtpIntegration.objects.all().order_by("-id")
    serializer_class = FtpIntegrationSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["post"])
    def test_connection(self, request, pk=None):
        """
        Placeholder endpoint to test FTP connection.
        You can later integrate ftplib here.
        """
        return Response(
            {"message": "FTP connection test endpoint triggered."},
            status=status.HTTP_200_OK,
        )


# ---------------------------
# API Integration ViewSet
# ---------------------------

class ApiIntegrationViewSet(viewsets.ModelViewSet):
    queryset = ApiIntegration.objects.all().order_by("-id")
    serializer_class = ApiIntegrationSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["post"])
    def test_api(self, request, pk=None):
        """
        Placeholder endpoint to test API connection.
        You can integrate requests library here.
        """
        return Response(
            {"message": "API test endpoint triggered."},
            status=status.HTTP_200_OK,
        )
