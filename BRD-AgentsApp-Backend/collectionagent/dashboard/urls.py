
from django.urls import path
from . import views
from .views import dashboard_home, DashboardView
from .views import QuickStatsView

urlpatterns = [

    # ✅ Main Dashboard API
    path('', dashboard_home),   # /api/dashboard/

    # ✅ Stats
    path('stats/', DashboardView.as_view()),

    # ✅ Notifications
    path('notifications/', views.notifications, name='notifications'),

    # ✅ Quick Actions (IMPORTANT 🔥)
    path('view-accounts/', views.view_accounts),
    path('recovery-history/', views.recovery_history),
    path("quick-stats/", QuickStatsView.as_view(), name="quick-stats"),

    # ✅ Extra APIs
    path('ptp/', views.get_ptp),
    path('data/', views.dashboard_data),

]




