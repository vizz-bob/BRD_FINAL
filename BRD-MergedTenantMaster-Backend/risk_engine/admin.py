from django.contrib import admin
from .models import CreditScoreRule, NegativeArea
@admin.register(CreditScoreRule)
class CreditScoreRuleAdmin(admin.ModelAdmin):
    list_display = (
        'parameter',
        'condition',
        'value',
        'impact_score',
        'employment_type',
        'is_active'
    )
    list_filter = ('employment_type', 'is_active')
@admin.register(NegativeArea)
class NegativeAreaAdmin(admin.ModelAdmin):
    list_display = ('pincode', 'city', 'risk_level', 'is_active')
    list_filter = ('risk_level',)
