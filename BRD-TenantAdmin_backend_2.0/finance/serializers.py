from rest_framework import serializers
from .models import (
    ManageFinancialYear,
    ManageAssessmentYear,
    ManageReportingPeriod,
    ManageHoliday,
    ManageWorkingDay,
    ManageWorkingHour,
    ManageOvertime,
)


# =====================================================
# Financial Year Serializer
# =====================================================
class FinancialYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageFinancialYear
        fields = "__all__"
        read_only_fields = ("name",)


# =====================================================
# Assessment Year Serializer
# =====================================================
class AssessmentYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageAssessmentYear
        fields = "__all__"
        read_only_fields = ("name", "start_date", "end_date")

    def validate_financial_year(self, fy):
        if fy.status != "active":
            raise serializers.ValidationError(
                "Assessment Year must be linked to an active Financial Year"
            )
        return fy


# =====================================================
# Reporting Period Serializer
# =====================================================
class ReportingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageReportingPeriod
        fields = "__all__"


# =====================================================
# Holiday Serializer
# =====================================================
class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageHoliday
        fields = "__all__"


# =====================================================
# Working Day Serializer
# =====================================================
class WorkingDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageWorkingDay
        fields = "__all__"


# =====================================================
# Working Hour Serializer
# =====================================================
class WorkingHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageWorkingHour
        fields = "__all__"


# =====================================================
# Overtime Serializer
# =====================================================
class OvertimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManageOvertime
        fields = "__all__"
