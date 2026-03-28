from rest_framework import viewsets
from .models import (
    PredefinedTemplate,
    CustomisedTemplate,
    FieldMaster,
)
from .serializers import (
    PredefinedTemplateSerializer,
    CustomisedTemplateSerializer,
    FieldMasterSerializer,
)


# ==========================
# PREDEFINED TEMPLATE VIEW
# ==========================
class PredefinedTemplateViewSet(viewsets.ModelViewSet):
    queryset = PredefinedTemplate.objects.all()
    serializer_class = PredefinedTemplateSerializer


# ==========================
# FIELD MASTER VIEW
# ==========================
class FieldMasterViewSet(viewsets.ModelViewSet):
    queryset = FieldMaster.objects.all()
    serializer_class = FieldMasterSerializer


# ==========================
# CUSTOMISED TEMPLATE VIEW
# ==========================
class CustomisedTemplateViewSet(viewsets.ModelViewSet):
    queryset = CustomisedTemplate.objects.all()
    serializer_class = CustomisedTemplateSerializer
