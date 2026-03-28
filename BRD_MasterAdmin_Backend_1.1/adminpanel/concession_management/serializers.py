from rest_framework import serializers
from .models import ConcessionType, ConcessionCategory


class ConcessionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConcessionType
        fields = "__all__"
        read_only_fields = (
            "uuid",
            "created_user",
            "modified_user",
            "created_at",
            "modified_at",
            "isDeleted",
        )



class ConcessionCategorySerializer(serializers.ModelSerializer):
    # 👇 This exposes the TYPE NAME in response
    concession_type_name = serializers.CharField(
        source="linked_concession_type.concession_type_name",
        read_only=True
    )

    class Meta:
        model = ConcessionCategory
        fields = [
            "uuid",
            "category_name",
            "product_type",
            "valid_from",
            "valid_to",
            "eligibility_criteria",
            "status",
            "linked_concession_type",  # UUID (for edit)
            "concession_type_name",    # Name (for UI)
            "created_user",
            "modified_user",
            "created_at",
            "modified_at",
            "isDeleted",
        ]

        read_only_fields = (
            "uuid",
            "created_user",
            "modified_user",
            "created_at",
            "modified_at",
            "isDeleted",
        )
