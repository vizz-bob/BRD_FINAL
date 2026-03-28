from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainingModuleViewSet

router = DefaultRouter()
router.register('modules', TrainingModuleViewSet, basename='training-modules')

urlpatterns = [
    path('', include(router.urls)),
]
