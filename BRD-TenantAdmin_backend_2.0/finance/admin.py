from django.contrib import admin
from .models import (
    ManageFinancialYear,
    ManageAssessmentYear,
    ManageReportingPeriod,
    ManageHoliday,
    ManageWorkingDay,
    ManageWorkingHour,
    ManageOvertime,
)


@admin.register(ManageFinancialYear)
class FinancialYearAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "status")
    list_filter = ("status",)
    ordering = ("-start_date",)
    search_fields = ("name",)


@admin.register(ManageAssessmentYear)
class AssessmentYearAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "financial_year",
        "status",
        "financial_eligibility_years",
        "itr_years_required",
        "credit_assessment_enabled",
    )
    list_filter = ("status", "credit_assessment_enabled")
    search_fields = ("name",)
    autocomplete_fields = ("financial_year",)


@admin.register(ManageReportingPeriod)
class ReportingPeriodAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date")
    ordering = ("-start_date",)
    search_fields = ("name",)


@admin.register(ManageHoliday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ("date", "title")
    ordering = ("date",)
    search_fields = ("title",)


@admin.register(ManageWorkingDay)
class WorkingDayAdmin(admin.ModelAdmin):
    list_display = ("day", "is_working")
    list_filter = ("is_working",)


@admin.register(ManageWorkingHour)
class WorkingHourAdmin(admin.ModelAdmin):
    list_display = ("start_time", "end_time")


@admin.register(ManageOvertime)
class OvertimeAdmin(admin.ModelAdmin):
    list_display = ("enabled", "rate_multiplier")
