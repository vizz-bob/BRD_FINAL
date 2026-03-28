from django.urls import path
from .views import (
    DelinquencyListAPIView,
    DelinquencyDetailAPIView,
    DelinquencyCreateAPIView,
    DelinquencyUpdateAPIView,
    DelinquencyDeleteAPIView,
    OverdueLoansAPIView,
    CollectionStatsAPIView,
)

urlpatterns = [
    path("", DelinquencyListAPIView.as_view()),
    path("<int:id>/", DelinquencyDetailAPIView.as_view()),
    path("create/", DelinquencyCreateAPIView.as_view()),
    path("<int:id>/update/", DelinquencyUpdateAPIView.as_view()),
    path("<int:id>/delete/", DelinquencyDeleteAPIView.as_view()),
    path("overdue-loans/", OverdueLoansAPIView.as_view()),
    path("stats/", CollectionStatsAPIView.as_view()),
]
