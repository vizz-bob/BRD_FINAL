from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('documents', DocumentViewSet, basename='document')

urlpatterns = [
    path('', include(router.urls)),
]
