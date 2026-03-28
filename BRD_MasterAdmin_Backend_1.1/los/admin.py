# los/admin.py
from django.contrib import admin
from .models import LoanApplication, KYCDetail, CreditAssessment

@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ('application_id', 'customer', 'tenant', 'branch', 'amount', 'status', 'created_at')
    search_fields = ('application_id', 'customer__first_name', 'customer__phone')
    list_filter = ('status', 'tenant', 'branch')
    readonly_fields = ('application_id', 'created_at', 'updated_at')

@admin.register(KYCDetail)
class KYCDetailAdmin(admin.ModelAdmin):
    list_display = ('loan_application', 'kyc_type', 'document_number', 'status', 'uploaded_at')
    list_filter = ('kyc_type', 'status')
    search_fields = ('document_number',)
    readonly_fields = ('uploaded_at',)

@admin.register(CreditAssessment)
class CreditAssessmentAdmin(admin.ModelAdmin):
    list_display = ('application', 'score', 'status', 'approved_limit', 'assessed_at')
    search_fields = ('application__application_id',)
    readonly_fields = ('assessed_at',)
