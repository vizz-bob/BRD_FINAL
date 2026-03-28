from django.contrib import admin
from .models import LMSLoanAccount

@admin.register(LMSLoanAccount)
class LMSLoanAccountAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "borrower",
        "amount",
        "penny_drop_status",
        "enach_status",
        "action",
        
    )
