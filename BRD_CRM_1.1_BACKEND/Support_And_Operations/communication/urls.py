from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommunicationViewSet

router = DefaultRouter()
router.register(r'communications', CommunicationViewSet, basename='communications')

urlpatterns = [
    path('', include(router.urls)),
]
