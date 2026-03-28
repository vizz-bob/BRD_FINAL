# compliance/admin.py
from django.contrib import admin
from .models import ComplianceCheck, RiskFlag


@admin.register(ComplianceCheck)
class ComplianceCheckAdmin(admin.ModelAdmin):
    list_display = ('check_type', 'tenant', 'status', 'created_at')
    search_fields = ('check_type', 'status')
    list_filter = ('check_type', 'status')


@admin.register(RiskFlag)
class RiskFlagAdmin(admin.ModelAdmin):
    list_display = ('title', 'severity', 'tenant', 'created_at')
    search_fields = ('title', 'severity')
    list_filter = ('severity',)
