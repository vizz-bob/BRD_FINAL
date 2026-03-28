from django.urls import path,include
from .views import (
    PropertyInformationListCreateView,
    PropertyInformationDetailView
)
from rest_framework.routers import DefaultRouter
from .views import ValuationAssessmentViewSet,ClientInformationViewSet
from .views import DetailsViewSet,DocumentsViewSet,RecentValuationViewSet
#-----------------------
# Property Information
#------------------------
urlpatterns = [
    path('properties/', PropertyInformationListCreateView.as_view(), name='property-list-create'),
    path('properties/<int:pk>/', PropertyInformationDetailView.as_view(), name='property-detail'),
]
#-----------------------------
# Valuation Assessment
#-----------------------------
router = DefaultRouter()
router.register(r'valuations', ValuationAssessmentViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
#--------------------------
#Client Information
#--------------------------
router.register(r'clients', ClientInformationViewSet)
#-----------------------------
# Details
#-----------------------------
router.register(r'details', DetailsViewSet)
#----------------------------
# Documents
#--------------------------
router.register(r'documents', DocumentsViewSet)
#----------------------------
# Recent valuation
#----------------------------
router = DefaultRouter()
router.register(r'recent-valuations', RecentValuationViewSet)
urlpatterns = [
    path('', include(router.urls)),
]