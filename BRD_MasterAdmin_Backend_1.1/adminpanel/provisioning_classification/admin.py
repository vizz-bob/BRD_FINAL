from django.contrib import admin
from .models import *

admin.site.register(LoanClassification)
admin.site.register(WriteOffRule)
admin.site.register(SettlementRule)
admin.site.register(ProvisioningNPA)
admin.site.register(IncentiveManagement)
