from django.contrib import admin
from .models import (
    Bank,
    FundType,
    Fund,
    Portfolio,
    ModeOfBank,
    Tax,
    BusinessModel,
)

admin.site.register(Bank)
admin.site.register(FundType)
admin.site.register(Fund)
admin.site.register(Portfolio)
admin.site.register(ModeOfBank)
admin.site.register(Tax)
admin.site.register(BusinessModel)
