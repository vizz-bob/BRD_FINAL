
import re
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.db.models import Q
from django.db import transaction
from django.core.files.storage import default_storage
from django.contrib.auth import get_user_model

from .models import (
    Payment, RecoveryFollowUp, Vehicle, RecoveryActivity, YardEntry, YardPhoto
)
from collectionagent.accounts import models as accounts_models
from collectionagent.user_profile import models as user_profile_models

from .serializers import (
    PaymentSerializer, FollowUpSerializer,
    VehicleSerializer, ActivitySerializer
)
from collectionagent.accounts import serializers as accounts_serializers
from collectionagent.user_profile import serializers as user_profile_serializers

from .utils.ocr import extract_number_plate
from .models import RecoveryRepossessionHistory
from .serializers import RecoveryRepossessionHistorySerializer
from django.shortcuts import render, redirect
from .models import VehicleScan
from .forms import VehicleScanForm

User = get_user_model()

# =====================================================
# ✅ COMMON FUNCTION (CLEAN OCR)
# =====================================================

def clean_plate(text):
    if not text:
        return None
    plates = re.findall(r'[A-Z0-9]{6,10}', text.upper())
    return plates[0] if plates else None


# =====================================================
# ✅ PAYMENT & FOLLOWUP
# =====================================================

class CreatePaymentView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


class CreateFollowUpView(generics.CreateAPIView):
    queryset = RecoveryFollowUp.objects.all()
    serializer_class = FollowUpSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()


# =====================================================
# ✅ DASHBOARD
# =====================================================

class RecoveryDashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = Vehicle.objects.values('status')

        return Response({
            "total": Vehicle.objects.count(),
            "pending": data.filter(status='Pending').count(),
            "repossessed": data.filter(status='Repossessed').count(),
            "in_yard": data.filter(status='In Yard').count(),
        })


# =====================================================
# ✅ REPO LIST (SEARCH + FILTER + ORDER)
# =====================================================

class RepoListView(generics.ListAPIView):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        search = self.request.GET.get('search')
        status_filter = self.request.GET.get('status')

        queryset = Vehicle.objects.all().order_by('-id')

        if status_filter and status_filter != 'All':
            queryset = queryset.filter(status=status_filter)

        if search:
            queryset = queryset.filter(
                Q(vehicle_number__icontains=search)
            )

        return queryset


# =====================================================
# ✅ SCAN VEHICLE (OCR + CLEAN)
# =====================================================

class ScanVehicle(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image = request.FILES.get('image')
        plate_manual = request.data.get('plate')

        if not image and not plate_manual:
            return Response(
                {"error": "Provide image or plate"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            plate = plate_manual

            if image:
                path = default_storage.save(f'temp/{image.name}', image)
                full_path = default_storage.path(path)

                raw_text = extract_number_plate(full_path)
                plate = clean_plate(raw_text)

            if not plate:
                return Response(
                    {"error": "Plate not detected"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            vehicle = Vehicle.objects.filter(
                vehicle_number__icontains=plate
            ).first()

            if vehicle:
                RecoveryActivity.objects.create(
                    vehicle=vehicle,
                    action='Scan',
                    created_by=request.user
                )

                return Response({
                    "found": True,
                    "plate": plate,
                    "data": VehicleSerializer(vehicle).data
                })

            return Response({"found": False, "plate": plate})

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =====================================================
# ✅ MANUAL ENTRY
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manual_entry(request):
    plate = request.data.get('plate')

    if not plate:
        return Response(
            {"error": "Plate is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    vehicle = Vehicle.objects.filter(
        vehicle_number__icontains=plate
    ).first()

    if vehicle:
        return Response({
            "found": True,
            "data": VehicleSerializer(vehicle).data
        })

    return Response({"found": False})


# =====================================================
# ✅ MARK REPOSSESSED
# =====================================================

class MarkRepossessed(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        vehicle_id = request.data.get('vehicle_id')

        if not vehicle_id:
            return Response(
                {"error": "vehicle_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)

            vehicle.status = 'Repossessed'
            vehicle.save(update_fields=['status'])

            RecoveryActivity.objects.create(
                vehicle=vehicle,
                action='Repossessed',
                created_by=request.user
            )

            return Response({"message": "Vehicle repossessed"})

        except Vehicle.DoesNotExist:
            return Response(
                {"error": "Vehicle not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =====================================================
# ✅ YARD ENTRY (SAFE + TRANSACTION)
# =====================================================

class YardEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def to_bool(self, value):
        return str(value).lower() in ["true", "1", "yes"]

    @transaction.atomic
    def post(self, request):
        vehicle_id = request.data.get("vehicle_id")

        if not vehicle_id:
            return Response(
                {"error": "vehicle_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vehicle = Vehicle.objects.select_for_update().get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response(
                {"error": "Vehicle not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if hasattr(vehicle, "yard_entry"):
            return Response(
                {"error": "Already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        images = request.FILES.getlist("photos")

        if len(images) < 4:
            return Response(
                {"error": "Minimum 4 images required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        yard_entry = YardEntry.objects.create(
            vehicle=vehicle,
            odometer_reading=request.data.get("odometer_reading"),
            fuel_level=request.data.get("fuel_level"),
            vehicle_condition=request.data.get("vehicle_condition"),
            tyres_condition=request.data.get("tyres_condition"),
            spare_tyre=self.to_bool(request.data.get("spare_tyre")),
            jack=self.to_bool(request.data.get("jack")),
            toolkit=self.to_bool(request.data.get("toolkit")),
            floor_mats=self.to_bool(request.data.get("floor_mats")),
            music_system=self.to_bool(request.data.get("music_system")),
            rc_available=self.to_bool(request.data.get("rc_available")),
            insurance_available=self.to_bool(request.data.get("insurance_available")),
            pollution_available=self.to_bool(request.data.get("pollution_available")),
            servicebook_available=self.to_bool(request.data.get("servicebook_available")),
            damages=request.data.get("damages"),
            created_by=request.user
        )

        for image in images:
            YardPhoto.objects.create(yard_entry=yard_entry, image=image)

        vehicle.status = "In Yard"
        vehicle.save(update_fields=["status"])

        RecoveryActivity.objects.create(
            vehicle=vehicle,
            action="Yard Entry Completed",
            created_by=request.user
        )

        return Response(
            {"message": "Yard Entry Completed"},
            status=status.HTTP_201_CREATED
        )


# =====================================================
# ✅ ACTIVITY & HISTORY
# =====================================================

class ActivityList(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecoveryActivity.objects.select_related('vehicle').order_by('-timestamp')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vehicle_history(request, id):
    activities = RecoveryActivity.objects.filter(
        vehicle_id=id
    ).order_by('-timestamp')

    return Response(ActivitySerializer(activities, many=True).data)


class UpdateSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            user = get_user_model().objects.get(id=user_id)
            profile = user_profile_models.AgentProfile.objects.get(user=user)
        except get_user_model().DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except user_profile_models.AgentProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

        settings = user_profile_models.AppSettings.objects.filter(agent=profile).first()

        if not settings:
            settings = user_profile_models.AppSettings.objects.create(agent=profile)

        serializer = user_profile_serializers.AppSettingsSerializer(settings, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Updated", "data": serializer.data})

        return Response(serializer.errors, status=400)


class RepossessionHistoryList(APIView):

    def get(self, request):
        data = RecoveryRepossessionHistory.objects.all().order_by('-created_at')
        serializer = RecoveryRepossessionHistorySerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecoveryRepossessionHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import cv2
import pytesseract
import numpy as np

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe" #temporary 

class VehicleScannerView(APIView):
    def post(self, request):
        image = request.FILES.get('image')

        if not image:
            return Response({"error": "No image uploaded"}, status=400)

        try:
            # Convert image to OpenCV format
            file_bytes = np.asarray(bytearray(image.read()), dtype=np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # Apply threshold
            _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

            # OCR
            text = pytesseract.image_to_string(thresh)

            return Response({
                "vehicle_number": text.strip()
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

from django.views import View

class UploadScanView(View):
    def get(self, request):
        form = VehicleScanForm()
        return render(request, 'upload_scan.html', {'form': form})

    def post(self, request):
        form = VehicleScanForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('upload-scan')
        return render(request, 'upload_scan.html', {'form': form})

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import RecoveryRepossessionHistory

class VehicleMatchCheckView(APIView):
    """
    Check if a vehicle is in repossession list.
    Returns all details if matched.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, vehicle_number):
        try:
            # Lookup vehicle in repossession list
            repossession = accounts_models.RepossessionHistory.objects.select_related('account').get(
                account__vehicle_number=vehicle_number
            )
        except accounts_models.RepossessionHistory.DoesNotExist:
            return Response({"match": False, "message": "Vehicle not found in repossession list"}, status=404)

        account = repossession.account
        data = {
            "match": True,
            "vehicle_number": account.vehicle_number,
            "customer_name": account.account_name,
            "loan_id": account.loan_id,
            "overdue_amount": float(account.overdue_amount),
            "last_location": account.location,
            "repossessed_status": repossession.status,
            "remarks": repossession.remarks,
            "repossessed_at": repossession.repossessed_at
        }

        return Response(data)
