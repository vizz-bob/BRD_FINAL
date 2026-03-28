from django.contrib import admin
from .models import *

admin.site.register(RuleMaster)
admin.site.register(ImpactValue)
admin.site.register(ClientProfileRule)
admin.site.register(CollateralQualityRule)
admin.site.register(FinancialEligibilityRule)
admin.site.register(CreditHistoryRule)
admin.site.register(InternalScoreRule)
admin.site.register(GeoLocationRule)
admin.site.register(RiskMitigationRule)
admin.site.register(InternalVerificationRule)
admin.site.register(AgencyVerificationRule)
