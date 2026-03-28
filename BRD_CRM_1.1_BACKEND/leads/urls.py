from django.urls import path
from .views import LeadsStatusView

urlpatterns = [
    path('status/', LeadsStatusView.as_view()),
]
