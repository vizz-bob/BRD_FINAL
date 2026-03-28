from django.contrib import admin
from .models import *

admin.site.register(DisbursementStage)
admin.site.register(DisbursementAgency)
admin.site.register(DisbursementFrequency)
admin.site.register(DisbursementDocument)
admin.site.register(DownPayment)
admin.site.register(DisbursementThirdParty)
admin.site.register(Disbursement)
