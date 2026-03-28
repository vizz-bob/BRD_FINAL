from rest_framework import serializers
from .models import (
    PredefinedTemplate,
    CustomisedTemplate,
    FieldMaster,
)


# ==========================
# FIELD MASTER SERIALIZER
# ==========================
class FieldMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldMaster
        fields = "__all__"


# ==========================
# PREDEFINED TEMPLATE SERIALIZER
# ==========================
class PredefinedTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedTemplate
        fields = "__all__"


# ==========================
# CUSTOMISED TEMPLATE SERIALIZER
# ==========================
class CustomisedTemplateSerializer(serializers.ModelSerializer):
    field_masters = FieldMasterSerializer(many=True, read_only=True)
    field_master_ids = serializers.PrimaryKeyRelatedField(
        queryset=FieldMaster.objects.all(),
        many=True,
        write_only=True,
        source="field_masters",
    )

    class Meta:
        model = CustomisedTemplate
        fields = [
            "id",
            "template_name",
            "file",
            "template_type",
            "template_purpose",
            "is_mandatory",
            "requirement_notes",
            "field_masters",
            "field_master_ids",
            "is_active",
            "created_at",
        ]
