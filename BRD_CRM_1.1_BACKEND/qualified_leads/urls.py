from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QualifiedLeadViewSet, contact_lead_create, move_to_hot, mark_ineligible, document_upload, ExportQualifiedLeadsCSV

router = DefaultRouter()
router.register(r"qualified-leads", QualifiedLeadViewSet, basename="qualifiedlead")

urlpatterns = [
    path("", include(router.urls)),
    # 🔹 Export Qualified Leads
    path("export/", ExportQualifiedLeadsCSV.as_view(), name="qualified-lead-export"),
    path("contact/add/", contact_lead_create, name="contact_add"),
    path("contact/<int:pk>/hot/", move_to_hot, name="move_hot"),
    path("contact/<int:pk>/ineligible/", mark_ineligible, name="mark_ineligible"),
    path("documents/<int:lead_id>/", document_upload, name="document_upload"),
]
