from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, UploadDocumentsViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'uploads', UploadDocumentsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]