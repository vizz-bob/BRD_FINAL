#--------------------------------
# Property status pending
#---------------------------------
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyPendingViewSet, PropertyInProgressViewSet, PropertyCompletedViewSet
router = DefaultRouter()
router.register(r'property-pending', PropertyPendingViewSet, basename='property-pending')

router.register(r'property-in-progress', PropertyInProgressViewSet, basename='property-in-progress')
router.register(r'property-completed', PropertyCompletedViewSet, basename='property-completed')

urlpatterns = [
    path('', include(router.urls)),
]

from .views import StatusSearchView

urlpatterns = [
    path('status-search/', StatusSearchView.as_view()),
]