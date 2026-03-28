from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FinancialYearViewSet,
    AssessmentYearViewSet,
    ReportingPeriodViewSet,
    HolidayViewSet,
    WorkingDayViewSet,
    WorkingHourViewSet,
    OvertimeViewSet,
)

router = DefaultRouter()
router.register(r'financial-years', FinancialYearViewSet, basename='financial-year')
router.register(r'assessment-years', AssessmentYearViewSet, basename='assessment-year')
router.register(r'reporting-periods', ReportingPeriodViewSet, basename='reporting-period')
router.register(r'holidays', HolidayViewSet, basename='holiday')
router.register(r'working-days', WorkingDayViewSet, basename='working-day')
router.register(r'working-hours', WorkingHourViewSet, basename='working-hour')
router.register(r'overtime', OvertimeViewSet, basename='overtime')

urlpatterns = [
    path('', include(router.urls)),
]
