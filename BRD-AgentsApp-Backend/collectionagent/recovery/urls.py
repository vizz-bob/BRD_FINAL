from django.urls import path
from .views import UpdateSettingsView
from .views import (
    CreatePaymentView,
    CreateFollowUpView,
    RecoveryDashboard,
    RepoListView,
    ScanVehicle,
    YardEntryView,
    MarkRepossessed,
    ActivityList,
    vehicle_history,
    manual_entry,
)
from .views import RepossessionHistoryList
from .views import VehicleScannerView
from .views import VehicleMatchCheckView

urlpatterns = [
    # ✅ Payments & Followups
    path('payment/', CreatePaymentView.as_view()),
    path('followup/', CreateFollowUpView.as_view()),

    # ✅ Dashboard
    path('dashboard/', RecoveryDashboard.as_view()),

    # ✅ Repo List
    path('repo-list/', RepoListView.as_view()),

    # ✅ Scan (OCR + Manual Entry if plate provided)
    path('scan/', ScanVehicle.as_view()),
    path('manual-entry/', manual_entry),

    # ✅ Actions
    path('yard-entry/', YardEntryView.as_view(), name='yard-entry'),
    path('repossess/', MarkRepossessed.as_view()),

    # ✅ Activity & History
    path('activity/', ActivityList.as_view()),
    path('history/<int:id>/', vehicle_history),


    path('collect/', CreatePaymentView.as_view()),
    path('followup/', CreateFollowUpView.as_view()),
    path('dashboard/', RecoveryDashboard.as_view()),
    path('repo-list/', RepoListView.as_view()),
    path('scan/', ScanVehicle.as_view()),
    path('manual-entry/', manual_entry),
    path('mark-repossessed/', MarkRepossessed.as_view()),
    path('yard-entry/', YardEntryView.as_view()),
    path('activities/', ActivityList.as_view()),
    path('history/<int:id>/', vehicle_history),
    path('repossession-history/', RepossessionHistoryList.as_view()),
    path('scan-vehicle/', VehicleScannerView.as_view()),
     path('check-vehicle/<str:vehicle_number>/', VehicleMatchCheckView.as_view(), name='check_vehicle'),
]
