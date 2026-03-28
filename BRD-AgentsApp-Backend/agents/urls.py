from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SignUpView, SignInView, HomeView, CaseViewSet,AgentProfileViewSet,FieldVerificationViewSet, FieldVerificationPhotoViewSet,PrivacyPolicyView,FAQView,SupportContactView,SupportTicketViewSet,PrivacyPolicyView

router = DefaultRouter()
router.register('cases', CaseViewSet, basename='cases')
router.register('profile', AgentProfileViewSet, basename='agent-profile')
router.register('field-verification', FieldVerificationViewSet, basename='field-verification')
router.register('verification-photos', FieldVerificationPhotoViewSet)
# router.register('collection-profile', CollectionProfileViewSet, basename='collection-profile')
# router.register('accounts', AccountViewSet, basename='accounts')
# router.register('recovery', RecoveryViewSet, basename='recovery')
# router.register('followups', FollowUpViewSet,basename='followup')
# router.register('recovery-hub', RecoveryHubViewSet,basename='recovery-hub')
# router.register('recovery-photos', RecoveryHubPhotoViewSet, basename='photo-capture')
router.register('tickets', SupportTicketViewSet, basename='tickets')


urlpatterns = [
    path('signup/', SignUpView.as_view()),
    path('signin/', SignInView.as_view()),
    path('home/', HomeView.as_view()),
    path('privacy-policy/', PrivacyPolicyView.as_view()),
    path('faqs/', FAQView.as_view()),
    path('support-contact/', SupportContactView.as_view()),
    path('privacy-policy/', PrivacyPolicyView.as_view(), name='privacy-policy'),
    #path('collection-dashboard/', CollectionDashboardView.as_view()),
    path('', include(router.urls)),
]
# from accounts import urls
# from dashboard import urls
# from recovery import urls
# from user_profile import urls