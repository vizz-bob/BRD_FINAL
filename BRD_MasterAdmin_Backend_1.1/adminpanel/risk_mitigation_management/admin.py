from django.contrib import admin
from .models import *


admin.site.register(RiskManagement)
admin.site.register(RiskMitigation)
admin.site.register(DeviationManagement)
admin.site.register(RiskContainmentUnit)
admin.site.register(FraudManagement)
admin.site.register(PortfolioLimit)
admin.site.register(DefaultLimit)
admin.site.register(RiskOther)
