from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KnowledgeResourceViewSet

router = DefaultRouter()
router.register('', KnowledgeResourceViewSet, basename='knowledge-base')

urlpatterns = [
    path('', include(router.urls)),
]
