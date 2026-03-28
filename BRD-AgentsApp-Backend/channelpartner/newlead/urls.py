from django.urls import path
from .views import (
    OCRPanView, OCRAadhaarView, CreateLeadView, 
    ProductListView, GuidelineView, RequirementsView,
    CreateNewLeadRequestView, ListNewLeadRequestView,
    RetrieveNewLeadRequestView, UpdateNewLeadRequestView,
    DeleteNewLeadRequestView, ProductTypeChoicesView
)

urlpatterns = [
    path('pan/', OCRPanView.as_view(), name='ocr-pan'),
    path('aadhaar/', OCRAadhaarView.as_view(), name='ocr-aadhaar'),
    path('create/', CreateLeadView.as_view(), name='create-lead'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('guidelines/', GuidelineView.as_view(), name='lead-guidelines'),
    path('requirements/', RequirementsView.as_view(), name='lead-requirements'),
    path('product-types/', ProductTypeChoicesView.as_view(), name='product-types-choices'),
    
    # New Lead Request endpoints
    path('lead-request/create/', CreateNewLeadRequestView.as_view(), name='create-lead-request'),
    path('lead-request/list/', ListNewLeadRequestView.as_view(), name='list-lead-request'),
    path('lead-request/<int:id>/', RetrieveNewLeadRequestView.as_view(), name='retrieve-lead-request'),
    path('lead-request/<int:id>/update/', UpdateNewLeadRequestView.as_view(), name='update-lead-request'),
    path('lead-request/<int:id>/delete/', DeleteNewLeadRequestView.as_view(), name='delete-lead-request'),
]