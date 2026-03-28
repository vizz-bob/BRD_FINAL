from rest_framework.routers import DefaultRouter
from django.urls import path, include

urlpatterns = [
    path("accounts/", include("channelpartner.accounts.urls")),
    path("dashboard/", include("channelpartner.dashboard.urls")),
    path("leads/", include("channelpartner.leads.urls")),
    path("newlead/", include("channelpartner.newlead.urls")),
    path("payouts/", include("channelpartner.payouts.urls")),
    path("profiles/", include("channelpartner.profiles.urls")),
]
