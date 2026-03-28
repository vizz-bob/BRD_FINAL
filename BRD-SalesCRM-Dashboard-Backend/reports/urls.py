from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, WeeklySnapshotViewSet

router = DefaultRouter()
router.register(r'weekly', WeeklySnapshotViewSet, basename='weekly-snapshot')
router.register(r'', ReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
]