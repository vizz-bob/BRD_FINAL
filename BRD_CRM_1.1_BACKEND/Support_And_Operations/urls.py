from rest_framework.routers import DefaultRouter
from django.urls import path, include


urlpatterns = [
    path("communication/", include("Support_And_Operations.communication.urls")),
    path("training/", include("Support_And_Operations.training.urls")),
    path("support/", include("Support_And_Operations.support.urls")),
    path("roi/", include("Support_And_Operations.ROI.urls")),
]


