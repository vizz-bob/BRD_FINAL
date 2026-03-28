from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, AccountViewSet, ActivityViewSet,MeetingViewSet
from corecrm.views import get_csrf_token
from .views import MeetingViewSet


urlpatterns = [
    path("csrf/", get_csrf_token),
]

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'tasks', ActivityViewSet, basename='task')
router.register(r'meetings', MeetingViewSet, basename='meeting')

urlpatterns = [
    path('', include(router.urls)),
]




