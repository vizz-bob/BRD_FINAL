from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.shortcuts import render
from django.utils import timezone

from .models import (
    EmailCampaign,
    DialerCampaign,
    SmsCampaign,
    WhatsAppCampaign,
    VoiceBroadcastCampaign,
    SocialMediaCampaign,
    DialerDashboard,
    SMSDashboard,
    VoicebroadcastDashboard,
    WhatsappDashboard,
    socialmediadashboard,
    EmailDashboard,
)

from .serializers import (
    EmailCampaignSerializer,
    DialerCampaignSerializer,
    SmsCampaignSerializer,
    WhatsAppCampaignSerializer,
    VoiceBroadcastCampaignSerializer,
    SocialMediaCampaignSerializer,
)
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


from .constants import (
    PRODUCT_CHOICES,
    TARGET_AUDIENCE_CHOICES,
    TIMING_CHOICES,
    RETRY_ATTEMPTS,
)


# =========================================================
# COMMON CAMPAIGN LAUNCH MIXIN
# =========================================================

class CampaignLaunchMixin:

    # Subclasses can override this to specify the timing field name
    timing_field = "timing"

    @action(detail=True, methods=["post"])
    def launch(self, request, pk=None):
        campaign = self.get_object()

        if campaign.status != "draft":
            return Response(
                {"error": "Campaign already launched or completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Read timing from the correct field name
        timing_value = getattr(campaign, self.timing_field, None)

        if timing_value is None:
            # If no timing field, just activate immediately
            campaign.status = "active"
            campaign.save(update_fields=["status"])
            return Response({"message": "Campaign started successfully."})

        # Launch Immediately
        if timing_value == "now":
            campaign.status = "active"
            campaign.save(update_fields=["status"])
            return Response({"message": "Campaign started successfully."})

        # Scheduled Launch
        if timing_value == "schedule":
            if not campaign.schedule_datetime:
                return Response(
                    {"error": "Schedule datetime is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if campaign.schedule_datetime <= timezone.now():
                return Response(
                    {"error": "Schedule datetime must be in the future."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            campaign.status = "scheduled"
            campaign.save(update_fields=["status"])
            return Response({"message": "Campaign scheduled successfully."})

        # Fallback — unknown timing value, just activate
        campaign.status = "active"
        campaign.save(update_fields=["status"])
        return Response({"message": "Campaign started successfully."})


# =========================================================
# EMAIL CAMPAIGN
# =========================================================

class EmailCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
    queryset = EmailCampaign.objects.all().order_by("-created_at")
    serializer_class = EmailCampaignSerializer
    parser_classes = [MultiPartParser, FormParser]


# =========================================================
# DIALER CAMPAIGN
# =========================================================

class DialerCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
    queryset = DialerCampaign.objects.all().order_by("-created_at")
    serializer_class = DialerCampaignSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]


# =========================================================
# SMS CAMPAIGN
# =========================================================

class SmsCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
    queryset = SmsCampaign.objects.all().order_by("-created_at")
    serializer_class = SmsCampaignSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# =========================================================
# WHATSAPP CAMPAIGN
# =========================================================

class WhatsAppCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
    queryset = WhatsAppCampaign.objects.all().order_by("-created_at")
    serializer_class = WhatsAppCampaignSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


# =========================================================
# VOICE BROADCAST CAMPAIGN
# =========================================================

class VoiceBroadcastCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
    queryset = VoiceBroadcastCampaign.objects.all().order_by("-created_at")
    serializer_class = VoiceBroadcastCampaignSerializer
    parser_classes = [MultiPartParser, FormParser]

    # Override launch because VoiceBroadcastCampaign may not have a 'timing' field
    @action(detail=True, methods=["post"])
    def launch(self, request, pk=None):
        campaign = self.get_object()

        if campaign.status != "draft":
            return Response(
                {"error": "Campaign already launched or completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if model has schedule_datetime — if set and in future, schedule it
        schedule_dt = getattr(campaign, "schedule_datetime", None)

        if schedule_dt and schedule_dt > timezone.now():
            campaign.status = "scheduled"
            campaign.save(update_fields=["status"])
            return Response({"message": "Voice campaign scheduled successfully."})

        # Otherwise launch immediately
        campaign.status = "active"
        campaign.save(update_fields=["status"])
        return Response({"message": "Voice campaign started successfully."})


# =========================================================
# SOCIAL MEDIA CAMPAIGN
# =========================================================

class SocialMediaCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
    queryset = SocialMediaCampaign.objects.all().order_by("-created_at")
    serializer_class = SocialMediaCampaignSerializer


# =========================================================
# STATIC METADATA API (FOR FRONTEND DROPDOWNS)
# =========================================================

class CampaignMetaDataAPIView(APIView):

    def get(self, request):
        return Response({
            "products": PRODUCT_CHOICES,
            "audience_groups": [
                {"value": key, "label": label}
                for key, label in TARGET_AUDIENCE_CHOICES
            ],
            "timing_choices": TIMING_CHOICES,
            "retry_attempts": [
                {"value": key, "label": label}
                for key, label in RETRY_ATTEMPTS
            ],
        })


# =========================================================
# DASHBOARD API ENDPOINTS
# =========================================================

class DialerDashboardAPIView(APIView):
    def get(self, request):
        dashboard = DialerDashboard.objects.first()
        return Response({
            "active_campaigns": dashboard.active_campaigns if dashboard else 0,
            "total_calls": dashboard.total_calls if dashboard else 0,
            "avg_connect_rate": dashboard.Avg_Connect_Rate if dashboard else 0,
            "engaged_leads": dashboard.engaged_leads if dashboard else 0,
        })


class EmailDashboardAPIView(APIView):
    def get(self, request):
        dashboard = EmailDashboard.objects.first()
        return Response({
            "active_campaigns": dashboard.active_campaigns if dashboard else 0,
            "total_sent": dashboard.total_sent if dashboard else 0,
            "avg_open_rate": dashboard.Avg_open_Rate if dashboard else 0,
            "engaged_leads": dashboard.engaged_leads if dashboard else 0,
        })


class SmsDashboardAPIView(APIView):
    def get(self, request):
        dashboard = SMSDashboard.objects.first()
        return Response({
            "active_campaigns": dashboard.active_SMS_campaigns if dashboard else 0,
            "message_sent_today": dashboard.message_sent_today if dashboard else 0,
            "avg_click_rate": dashboard.Avg_Click_Rate if dashboard else 0,
            "active_subscribers": dashboard.active_subscribers if dashboard else 0,
        })


class WhatsAppDashboardAPIView(APIView):
    def get(self, request):
        dashboard = WhatsappDashboard.objects.first()
        return Response({
            "active_campaigns": dashboard.active_campaigns if dashboard else 0,
            "total_sent": dashboard.total_sent if dashboard else 0,
            "avg_read_rate": dashboard.Avg_read_Rate if dashboard else 0,
            "engaged_leads": dashboard.engaged_leads if dashboard else 0,
        })


class VoiceBroadcastDashboardAPIView(APIView):
    def get(self, request):
        dashboard = VoicebroadcastDashboard.objects.first()
        return Response({
            "active_broadcast": dashboard.active_broadcast if dashboard else 0,
            "total_calls_made": dashboard.total_calls_made if dashboard else 0,
            "avg_answer_rate": dashboard.Avg_Answer_Rate if dashboard else 0,
            "keypad_responses": dashboard.keypad_reasponses if dashboard else 0,
        })


class SocialMediaDashboardAPIView(APIView):
    def get(self, request):
        dashboard = socialmediadashboard.objects.first()
        return Response({
            "active_campaigns": dashboard.active_campaigns if dashboard else 0,
            "total_impressions": dashboard.total_impressions if dashboard else 0,
            "engagement_rate": dashboard.engagement_Rate if dashboard else 0,
            "click_through_rate": dashboard.click_through_rate if dashboard else 0,
            "leads_generated": dashboard.leads_generated if dashboard else 0,
            "total_comments": dashboard.total_comments if dashboard else 0,
        })





# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser,JSONParser

# from django.shortcuts import render
# from django.utils import timezone

# from .models import (
#     EmailCampaign,
#     DialerCampaign,
#     SmsCampaign,
#     WhatsAppCampaign,
#     VoiceBroadcastCampaign,
#     SocialMediaCampaign,
#     DialerDashboard,
#     SMSDashboard,
#     VoicebroadcastDashboard,
#     WhatsappDashboard,
#     socialmediadashboard,
#     EmailDashboard,
# )

# from .serializers import (
#     EmailCampaignSerializer,
#     DialerCampaignSerializer,
#     SmsCampaignSerializer,
#     WhatsAppCampaignSerializer,
#     VoiceBroadcastCampaignSerializer,
#     SocialMediaCampaignSerializer,
# )
# from django.http import JsonResponse
# from django.views.decorators.csrf import ensure_csrf_cookie

# @ensure_csrf_cookie
# def get_csrf_token(request):
#     return JsonResponse({'detail': 'CSRF cookie set'})


# from .constants import (
#     PRODUCT_CHOICES,
#     TARGET_AUDIENCE_CHOICES,
#     TIMING_CHOICES,
#     RETRY_ATTEMPTS,
# )


# # =========================================================
# # COMMON CAMPAIGN LAUNCH MIXIN
# # =========================================================

# class CampaignLaunchMixin:

#     @action(detail=True, methods=["post"])
#     def launch(self, request, pk=None):
#         campaign = self.get_object()

#         if campaign.status != "draft":
#             return Response(
#                 {"error": "Campaign already launched or completed."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Launch Immediately
#         if campaign.timing == "now":
#             campaign.status = "active"
#             campaign.save(update_fields=["status"])
#             return Response({"message": "Campaign started successfully."})

#         # Scheduled Launch
#         if campaign.timing == "schedule":
#             if not campaign.schedule_datetime:
#                 return Response(
#                     {"error": "Schedule datetime is required."},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )

#             if campaign.schedule_datetime <= timezone.now():
#                 return Response(
#                     {"error": "Schedule datetime must be in the future."},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )

#             campaign.status = "scheduled"
#             campaign.save(update_fields=["status"])
#             return Response({"message": "Campaign scheduled successfully."})

#         return Response(
#             {"error": "Invalid timing configuration."},
#             status=status.HTTP_400_BAD_REQUEST,
#         )


# # =========================================================
# # EMAIL CAMPAIGN
# # =========================================================

# class EmailCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
#     queryset = EmailCampaign.objects.all().order_by("-created_at")
#     serializer_class = EmailCampaignSerializer
#     parser_classes = [MultiPartParser, FormParser]


# # =========================================================
# # DIALER CAMPAIGN
# # =========================================================

# class DialerCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
#     queryset = DialerCampaign.objects.all().order_by("-created_at")
#     serializer_class = DialerCampaignSerializer
#     parser_classes = [JSONParser, MultiPartParser, FormParser]


# # =========================================================
# # SMS CAMPAIGN
# # =========================================================

# class SmsCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
#     queryset = SmsCampaign.objects.all().order_by("-created_at")
#     serializer_class = SmsCampaignSerializer


# # =========================================================
# # WHATSAPP CAMPAIGN
# # =========================================================

# class WhatsAppCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
#     queryset = WhatsAppCampaign.objects.all().order_by("-created_at")
#     serializer_class = WhatsAppCampaignSerializer


# # =========================================================
# # VOICE BROADCAST CAMPAIGN
# # =========================================================

# class VoiceBroadcastCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
#     queryset = VoiceBroadcastCampaign.objects.all().order_by("-created_at")
#     serializer_class = VoiceBroadcastCampaignSerializer
#     parser_classes = [MultiPartParser, FormParser]


# # =========================================================
# # SOCIAL MEDIA CAMPAIGN
# # =========================================================

# class SocialMediaCampaignViewSet(CampaignLaunchMixin, viewsets.ModelViewSet):
#     queryset = SocialMediaCampaign.objects.all().order_by("-created_at")
#     serializer_class = SocialMediaCampaignSerializer


# # =========================================================
# # STATIC METADATA API (FOR FRONTEND DROPDOWNS)
# # =========================================================

# class CampaignMetaDataAPIView(APIView):

#     def get(self, request):
#         return Response({
#             "products": PRODUCT_CHOICES,
#             "audience_groups": [
#                 {"value": key, "label": label}
#                 for key, label in TARGET_AUDIENCE_CHOICES
#             ],
#             "timing_choices": TIMING_CHOICES,
#             "retry_attempts": [
#                 {"value": key, "label": label}
#                 for key, label in RETRY_ATTEMPTS
#             ],
#         })


# # =========================================================
# # DASHBOARD API ENDPOINTS
# # =========================================================

# class DialerDashboardAPIView(APIView):
#     def get(self, request):
#         dashboard = DialerDashboard.objects.first()
#         return Response({
#             "active_campaigns": dashboard.active_campaigns if dashboard else 0,
#             "total_calls": dashboard.total_calls if dashboard else 0,
#             "avg_connect_rate": dashboard.Avg_Connect_Rate if dashboard else 0,
#             "engaged_leads": dashboard.engaged_leads if dashboard else 0,
#         })


# class EmailDashboardAPIView(APIView):
#     def get(self, request):
#         dashboard = EmailDashboard.objects.first()
#         return Response({
#             "active_campaigns": dashboard.active_campaigns if dashboard else 0,
#             "total_sent": dashboard.total_sent if dashboard else 0,
#             "avg_open_rate": dashboard.Avg_open_Rate if dashboard else 0,
#             "engaged_leads": dashboard.engaged_leads if dashboard else 0,
#         })


# class SmsDashboardAPIView(APIView):
#     def get(self, request):
#         dashboard = SMSDashboard.objects.first()
#         return Response({
#             "active_campaigns": dashboard.active_SMS_campaigns if dashboard else 0,
#             "message_sent_today": dashboard.message_sent_today if dashboard else 0,
#             "avg_click_rate": dashboard.Avg_Click_Rate if dashboard else 0,
#             "active_subscribers": dashboard.active_subscribers if dashboard else 0,
#         })


# class WhatsAppDashboardAPIView(APIView):
#     def get(self, request):
#         dashboard = WhatsappDashboard.objects.first()
#         return Response({
#             "active_campaigns": dashboard.active_campaigns if dashboard else 0,
#             "total_sent": dashboard.total_sent if dashboard else 0,
#             "avg_read_rate": dashboard.Avg_read_Rate if dashboard else 0,
#             "engaged_leads": dashboard.engaged_leads if dashboard else 0,
#         })


# class VoiceBroadcastDashboardAPIView(APIView):
#     def get(self, request):
#         dashboard = VoicebroadcastDashboard.objects.first()
#         return Response({
#             "active_broadcast": dashboard.active_broadcast if dashboard else 0,
#             "total_calls_made": dashboard.total_calls_made if dashboard else 0,
#             "avg_answer_rate": dashboard.Avg_Answer_Rate if dashboard else 0,
#             "keypad_responses": dashboard.keypad_reasponses if dashboard else 0,
#         })


# class SocialMediaDashboardAPIView(APIView):
#     def get(self, request):
#         dashboard = socialmediadashboard.objects.first()
#         return Response({
#             "active_campaigns": dashboard.active_campaigns if dashboard else 0,
#             "total_impressions": dashboard.total_impressions if dashboard else 0,
#             "engagement_rate": dashboard.engagement_Rate if dashboard else 0,
#             "click_through_rate": dashboard.click_through_rate if dashboard else 0,
#             "leads_generated": dashboard.leads_generated if dashboard else 0,
#             "total_comments": dashboard.total_comments if dashboard else 0,
#         })
