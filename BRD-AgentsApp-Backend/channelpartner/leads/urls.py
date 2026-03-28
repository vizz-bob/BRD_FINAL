from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LeadViewSet, LeadQueryViewSet, LeadDocumentViewSet,
    LeadActivityViewSet, LeadCommentViewSet, LeadStatusHistoryViewSet, CustomerViewSet,
    ProductTypeChoicesView
)

router = DefaultRouter()
router.register(r'', LeadViewSet, basename='lead')
router.register(r'queries', LeadQueryViewSet, basename='lead-query')
router.register(r'documents', LeadDocumentViewSet, basename='lead-document')
router.register(r'activities', LeadActivityViewSet, basename='lead-activity')
router.register(r'comments', LeadCommentViewSet, basename='lead-comment')
router.register(r'timeline', LeadStatusHistoryViewSet, basename='lead-timeline')
router.register(r'customer', CustomerViewSet, basename='customer')

urlpatterns = [
    path('product-types/', ProductTypeChoicesView.as_view(), name='product-types-choices'),
    path('', include(router.urls)),
]
