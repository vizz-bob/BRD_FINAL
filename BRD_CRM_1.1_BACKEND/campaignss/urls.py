from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmailCampaignViewSet,
    SmsCampaignViewSet,
    DialerCampaignViewSet,
    WhatsAppCampaignViewSet,
    VoiceBroadcastCampaignViewSet,
    SocialMediaCampaignViewSet,
    CampaignMetaDataAPIView,
    get_csrf_token
)

# Router for your viewsets
router = DefaultRouter()
router.register(r"email-campaigns", EmailCampaignViewSet, basename="email-campaign")
router.register(r"sms-campaigns", SmsCampaignViewSet, basename="sms-campaign")
router.register(r"dialer-campaigns", DialerCampaignViewSet, basename="dialer-campaign")
router.register(r"whatsapp-campaigns", WhatsAppCampaignViewSet, basename="whatsapp-campaign")
router.register(r"voice-campaigns", VoiceBroadcastCampaignViewSet, basename="voice-campaign")
router.register(r"social-media-campaigns", SocialMediaCampaignViewSet, basename="social-media-campaign")

# ✅ Merged urlpatterns
urlpatterns = [
    path("csrf/", get_csrf_token),                        # CSRF endpoint
    path("", include(router.urls)),                       # all API routes
    path("metadata/", CampaignMetaDataAPIView.as_view(), name="campaign-metadata"),
]
