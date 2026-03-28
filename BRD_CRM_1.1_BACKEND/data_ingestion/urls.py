# data_ingestion/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'suppression-list', views.SuppressionListViewSet, basename='suppression-list')


urlpatterns = router.urls + [
    # RawLead endpoints
    path("ingestion-stats/", views.ingestion_stats),
    path('raw_leads/', views.RawLeadListCreateAPIView.as_view(), name='raw_leads_list_create'),
    path('raw_leads/<int:pk>/', views.RawLeadRetrieveUpdateDestroyAPIView.as_view(), name='raw_lead_detail'),
    # Validation Engine Configuration
    path('validation_config/', views.ValidationEngineConfigurationAPIView.as_view(), name='validation_config'),
]
