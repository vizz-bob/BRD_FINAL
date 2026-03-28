from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import (
    ManageFinancialYear,
    ManageAssessmentYear,
    ManageReportingPeriod,
    ManageHoliday,
    ManageWorkingDay,
    ManageWorkingHour,
    ManageOvertime,
)
from .serializers import (
    FinancialYearSerializer,
    AssessmentYearSerializer,
    ReportingPeriodSerializer,
    HolidaySerializer,
    WorkingDaySerializer,
    WorkingHourSerializer,
    OvertimeSerializer,
)


class FinancialYearViewSet(viewsets.ModelViewSet):
    queryset = ManageFinancialYear.objects.all()
    serializer_class = FinancialYearSerializer

    def create(self, request, *args, **kwargs):
        """Create a new financial year with proper error handling"""
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            
            # Check if making this active when another FY is already active
            if serializer.validated_data.get('status') == 'active':
                active_fy = ManageFinancialYear.objects.filter(status='active').first()
                if active_fy:
                    return Response(
                        {
                            "error": "Only one Financial Year can be active at a time",
                            "detail": f"'{active_fy.name}' is currently active. Please deactivate it first."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            instance = serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
            
        except DRFValidationError as e:
            return Response(
                {"error": "Validation failed", "detail": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DjangoValidationError as e:
            return Response(
                {"error": "Validation failed", "detail": e.message_dict},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Failed to create Financial Year", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        """Update financial year with validation"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        try:
            serializer.is_valid(raise_exception=True)
            
            # Check active status constraint
            if serializer.validated_data.get('status') == 'active':
                active_fy = ManageFinancialYear.objects.filter(status='active').exclude(id=instance.id).first()
                if active_fy:
                    return Response(
                        {
                            "error": "Only one Financial Year can be active at a time",
                            "detail": f"'{active_fy.name}' is currently active."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            self.perform_update(serializer)
            return Response(serializer.data)
            
        except DRFValidationError as e:
            return Response(
                {"error": "Validation failed", "detail": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DjangoValidationError as e:
            return Response(
                {"error": "Validation failed", "detail": e.message_dict},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Failed to update Financial Year", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AssessmentYearViewSet(viewsets.ModelViewSet):
    queryset = ManageAssessmentYear.objects.select_related("financial_year").all()
    serializer_class = AssessmentYearSerializer

    def create(self, request, *args, **kwargs):
        """Create assessment year with proper validation"""
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            
            # Additional validation for one-to-one relationship
            fy_id = serializer.validated_data.get('financial_year')
            if ManageAssessmentYear.objects.filter(financial_year=fy_id).exists():
                return Response(
                    {
                        "error": "Assessment Year already exists",
                        "detail": f"An Assessment Year is already linked to this Financial Year"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            instance = serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
            
        except DRFValidationError as e:
            return Response(
                {"error": "Validation failed", "detail": e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        except DjangoValidationError as e:
            return Response(
                {"error": "Validation failed", "detail": e.message_dict},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "Failed to create Assessment Year", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReportingPeriodViewSet(viewsets.ModelViewSet):
    queryset = ManageReportingPeriod.objects.all()
    serializer_class = ReportingPeriodSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": "Failed to create Reporting Period", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class HolidayViewSet(viewsets.ModelViewSet):
    queryset = ManageHoliday.objects.all().order_by('date')
    serializer_class = HolidaySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": "Failed to create Holiday", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class WorkingDayViewSet(viewsets.ModelViewSet):
    queryset = ManageWorkingDay.objects.all()
    serializer_class = WorkingDaySerializer


class WorkingHourViewSet(viewsets.ModelViewSet):
    queryset = ManageWorkingHour.objects.all()
    serializer_class = WorkingHourSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": "Failed to create Working Hours", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class OvertimeViewSet(viewsets.ModelViewSet):
    queryset = ManageOvertime.objects.all()
    serializer_class = OvertimeSerializer
