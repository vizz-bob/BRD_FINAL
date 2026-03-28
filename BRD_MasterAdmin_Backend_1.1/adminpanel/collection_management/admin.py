from django.contrib import admin
from .models import (
    PaymentGateway,
    CollectionControl,
    ClientTeamMapping,
    ClientAgentMapping,
    PayoutManagement,
)

admin.site.register(PaymentGateway)
admin.site.register(CollectionControl)
admin.site.register(ClientTeamMapping)
admin.site.register(ClientAgentMapping)
admin.site.register(PayoutManagement)
