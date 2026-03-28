from django.urls import path
from .views import BusinessCreateView, BusinessListView

urlpatterns = [
    path("", BusinessListView.as_view(), name="business-list"),          # GET
    path("create/", BusinessCreateView.as_view(), name="business-create"),  # POST
]

