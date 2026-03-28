from django.contrib import admin
from .models import DailyCollection, AgentStats, BucketSummary, PTP, Activity, Notification

admin.site.register(DailyCollection)
admin.site.register(AgentStats)
admin.site.register(BucketSummary)
admin.site.register(PTP)
admin.site.register(Activity)
admin.site.register(Notification)

# Register your models here.
from django.contrib import admin
from .models import AgentDailyStats

admin.site.register(AgentDailyStats)