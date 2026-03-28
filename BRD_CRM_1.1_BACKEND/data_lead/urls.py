from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    LeadViewSet, CampaignLeadViewSet, ThirdPartyLeadViewSet,
    InternalLeadViewSet, OnlineLeadViewSet, UsedLeadViewSet, ArchivedLeadViewSet,
)
from .views import UserListView  # add to existing import

from . import views
from .views import ReallocateAssignedLeadAPIView, reallocate_leads_view

router = DefaultRouter()
router.register(r'leads',           LeadViewSet,           basename='leads')
router.register(r'campaign-leads',  CampaignLeadViewSet,   basename='campaign-lead')
router.register(r'third-party-leads', ThirdPartyLeadViewSet, basename='third-party-lead')
router.register(r'internal-leads',  InternalLeadViewSet,   basename='internal-lead')
router.register(r'online-leads',    OnlineLeadViewSet,     basename='online-lead')
router.register(r'used-leads',      UsedLeadViewSet,       basename='used-lead')
router.register(r'archived-leads',  ArchivedLeadViewSet,   basename='archived-lead')

urlpatterns = router.urls + [
    # UploadData web views
    path("upload-data/",              views.upload_data_list,   name="upload_data_list"),
    path("upload-data/create/",       views.upload_data_create, name="upload_data_create"),
    path("upload-data/update/<int:pk>/", views.upload_data_update, name="upload_data_update"),
    path("upload-data/delete/<int:pk>/", views.upload_data_delete, name="upload_data_delete"),
    # AllocateData web views
    path("allocate-data/",            views.allocate_data_list,   name="allocate_data_list"),
    path("allocate-data/create/",     views.allocate_data_create, name="allocate_data_create"),
    path("allocate-data/delete/<int:pk>/", views.allocate_data_delete, name="allocate_data_delete"),
    # Reallocate
    path("reallocate-form/",          reallocate_leads_view,          name="reallocate_leads"),
    path("users/", UserListView.as_view(), name="user_list"),
    path("reallocate-api/",           ReallocateAssignedLeadAPIView.as_view(), name="reallocate_api"),
]
