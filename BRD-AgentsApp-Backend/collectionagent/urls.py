from rest_framework.routers import DefaultRouter
from django.urls import path, include

urlpatterns = [
    path("accounts/", include("collectionagent.accounts.urls")),
    path("dashboard/", include("collectionagent.dashboard.urls")),
    path("recovery/", include("collectionagent.recovery.urls")),
    path("user_profile/", include("collectionagent.user_profile.urls")),
]