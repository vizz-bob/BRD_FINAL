from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LoginView, ValidateView, SignInView,
    ProfileView, NotificationPrefsView, AvailabilityView,
    ChangePasswordView, TwoFactorView,
    TerritoryViewSet, IntegrationViewSet,
    GeneralSettingsView, PrivacySettingsView,
    DeleteAccountView,
    TeamMemberViewSet,
    DataPrivacySettingsView, ExportLeadsView, ExportReportsView,
)

router = DefaultRouter()
router.register(r'territories', TerritoryViewSet, basename='territory')
router.register(r'team-members', TeamMemberViewSet, basename='team-member')
router.register(r'integrations', IntegrationViewSet, basename='integration')

urlpatterns = [
    # Auth
    path('login/',            LoginView.as_view(),           name='login'),
    path('validate/',         ValidateView.as_view(),         name='validate'),
    path('signin/',           SignInView.as_view(),           name='signin'),

    # Profile
    path('profile/',                ProfileView.as_view(),           name='profile'),
    path('notifications/',          NotificationPrefsView.as_view(), name='notification-prefs'),
    path('availability/',           AvailabilityView.as_view(),      name='availability'),

    # Security
    path('change-password/',        ChangePasswordView.as_view(),    name='change-password'),
    path('two-factor/',             TwoFactorView.as_view(),         name='two-factor'),
    path('delete-account/',         DeleteAccountView.as_view(),     name='delete-account'),

    # General / Privacy
    path('general-settings/',       GeneralSettingsView.as_view(),   name='general-settings'),
    path('privacy-settings/',       PrivacySettingsView.as_view(),   name='privacy-settings'),

    # Data & Privacy
    path('data-privacy/',                   DataPrivacySettingsView.as_view(), name='data-privacy-settings'),
    path('data-privacy/export-leads/',      ExportLeadsView.as_view(),         name='export-leads'),
    path('data-privacy/export-reports/',    ExportReportsView.as_view(),       name='export-reports'),

    # Territories & Integrations (router-based)
    path('', include(router.urls)),
]
