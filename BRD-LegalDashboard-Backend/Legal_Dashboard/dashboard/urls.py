from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentDetailAPIView
from .views import (
    DocumentViewSet,
    ReviewViewSet,
    ReportViewSet,
    DashboardSummaryAPIView
)

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard-summary/', DashboardSummaryAPIView.as_view()),
    path('documents/<str:document_id>/', DocumentDetailAPIView.as_view()),
]