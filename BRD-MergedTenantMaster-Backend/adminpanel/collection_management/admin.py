from django.contrib import admin
from .models import (
    PaymentGateway,
    CollectionControl,
    ClientTeamMapping,
    ClientAgentMapping,
    PayoutManagement,
    OverdueLoan,
    CollectionStats,
    CollectionAction,
)

admin.site.register(PaymentGateway)
admin.site.register(CollectionControl)
admin.site.register(ClientTeamMapping)
admin.site.register(ClientAgentMapping)
admin.site.register(PayoutManagement)
admin.site.register(OverdueLoan)
admin.site.register(CollectionStats)
admin.site.register(CollectionAction)
