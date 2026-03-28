from django.urls import path
from .views import (
    CreatePartner,
    ListPartners,
    UpdatePartner,
    DeletePartner,
)

urlpatterns = [
    path("partners/", ListPartners.as_view()),
    path("partners/create/", CreatePartner.as_view()),
    path("partners/<uuid:pk>/", UpdatePartner.as_view()),
    path("partners/<uuid:pk>/delete/", DeletePartner.as_view()),
]
