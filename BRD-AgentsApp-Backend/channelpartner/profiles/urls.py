from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MyProfileView, ProfileSettingsUpdateView, UserDocumentViewSet,
    ProfilePrivacySettingsView, ProfileSecuritySettingsView,
    PrivacyPolicyView, PrivacyPolicyDetailView, PrivacyNoticeView,
    SupportContactInfoView, SupportTicketViewSet, PrivacyPolicyWithSupportView
)

router = DefaultRouter()
router.register(r'documents', UserDocumentViewSet, basename='user-document')
router.register(r'support-tickets', SupportTicketViewSet, basename='support-ticket')

urlpatterns = [
    path('me/', MyProfileView.as_view(), name='my-profile'),
    path('settings/', ProfileSettingsUpdateView.as_view(), name='profile-settings'),
    path('settings/privacy/', ProfilePrivacySettingsView.as_view(), name='profile-privacy'),
    path('settings/security/', ProfileSecuritySettingsView.as_view(), name='profile-security'),
    path('privacy-policy/', PrivacyPolicyView.as_view(), name='privacy-policy'),
    path('privacy-policy/<int:pk>/', PrivacyPolicyDetailView.as_view(), name='privacy-policy-detail'),
    path('privacy-notice/', PrivacyNoticeView.as_view(), name='privacy-notice'),
    path('privacy-policy-with-support/', PrivacyPolicyWithSupportView.as_view(), name='privacy-policy-with-support'),
    path('support/contact-info/', SupportContactInfoView.as_view(), name='support-contact-info'),
    path('', include(router.urls)),
]
