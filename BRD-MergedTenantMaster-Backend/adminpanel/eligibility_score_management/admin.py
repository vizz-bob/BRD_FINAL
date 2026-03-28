from django.contrib import admin
from .models import (
    EligibilityManagement,
    BankingManagement,
    ExistingObligationManagement,
    ScoreCardManagement,
)


@admin.register(EligibilityManagement)
class EligibilityManagementAdmin(admin.ModelAdmin):
    list_display = ("applicant_type", "category", "income_type", "is_active", "created_at")


@admin.register(BankingManagement)
class BankingManagementAdmin(admin.ModelAdmin):
    list_display = ("bank_account_type", "average_banking_criteria", "is_active", "created_at")


@admin.register(ExistingObligationManagement)
class ExistingObligationManagementAdmin(admin.ModelAdmin):
    list_display = ("loan_status", "loan_performance", "total_loans", "is_active", "created_at")


@admin.register(ScoreCardManagement)
class ScoreCardManagementAdmin(admin.ModelAdmin):
    list_display = ("impact_type", "risk_impact", "is_active", "created_at")
