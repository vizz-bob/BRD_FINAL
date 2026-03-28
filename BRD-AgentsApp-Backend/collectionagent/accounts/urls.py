from django.urls import path
from .views import CollectionAccountListView, CreateRecoveryView, CreateFollowUpView
from .views import RecoveryListView
from .views import FollowUpListView 
from .views import RepossessionListView
from .views import call_phone
from .views import CallPhoneAPI
from .views import (
    AccountActionLinksView,
    PTPHistoryView,
    CallHistoryView,
    PaymentHistoryView,
    VisitRecordingListCreateView,
    VisitRecordingDetailView,
    VisitPhotoUploadView,
    VisitAudioUploadView,
)


urlpatterns = [
    path('', CollectionAccountListView.as_view()),
     path('accounts/', CollectionAccountListView.as_view(), name='account-list'),
    path('recoveries/', CreateRecoveryView.as_view(), name='create-recovery'),
    path('recovery/create/', CreateRecoveryView.as_view()),
    path('recovery/list/', RecoveryListView.as_view()),

    path('followup/create/', CreateFollowUpView.as_view()),
    path('followup/list/', FollowUpListView.as_view()),
    # path('something/', SomeView.as_view()),
    path('repossession/', RepossessionListView.as_view()),
    path('history/ptp/', PTPHistoryView.as_view(), name='ptp-history'),
    path('history/calls/', CallHistoryView.as_view(), name='call-history'),
    path('history/payments/', PaymentHistoryView.as_view(), name='payment-history'),
    path('visits/', VisitRecordingListCreateView.as_view(), name='visit-list-create'),
    path('visits/<int:visit_id>/', VisitRecordingDetailView.as_view(), name='visit-detail'),
    path('visits/<int:visit_id>/photos/', VisitPhotoUploadView.as_view(), name='visit-photo-upload'),
    path('visits/<int:visit_id>/audio/', VisitAudioUploadView.as_view(), name='visit-audio-upload'),
    path('call/', call_phone, name='call-phone'),
     path('api/call-phone/', CallPhoneAPI.as_view(), name='call-phone-api'),
    path('api/account/<uuid:account_id>/links/', AccountActionLinksView.as_view(), name='account-links'),
]
