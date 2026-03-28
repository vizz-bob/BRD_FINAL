from rest_framework import serializers
from .models import LoanApplication, CreditAssessment, PropertyDetail


# ============================================================
# CREDIT ASSESSMENT SERIALIZER
# ============================================================
class CreditAssessmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = CreditAssessment
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at")


# ============================================================
# PROPERTY DETAIL SERIALIZER
# ============================================================
class PropertyDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = PropertyDetail
        fields = "__all__"
        read_only_fields = ("created_at",)


# ============================================================
# LOAN APPLICATION SERIALIZER
# ============================================================
class LoanApplicationSerializer(serializers.ModelSerializer):

    # Nested Relations
    credit_assessment = CreditAssessmentSerializer(read_only=True)
    property_detail = PropertyDetailSerializer(read_only=True)

    # Computed field
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = LoanApplication
        fields = "__all__"
        read_only_fields = (
            "application_id",
            "application_number",
            "created_by",
            "created_at",
        )

    # ------------------------------------------
    # COMPUTED FIELD
    # ------------------------------------------
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    # ------------------------------------------
    # NORMALIZE INPUT
    # ------------------------------------------
    def to_internal_value(self, data):
        data = data.copy()

        if data.get("income_type"):
            data["income_type"] = (
                data["income_type"]
                .upper()
                .replace(" ", "_")
                .replace("-", "_")
            )

        if data.get("employment_type"):
            data["employment_type"] = (
                data["employment_type"]
                .upper()
                .replace(" ", "_")
                .replace("-", "_")
            )

        return super().to_internal_value(data)

    # ------------------------------------------
    # BUSINESS VALIDATION
    # ------------------------------------------
    def validate(self, attrs):
        income_type = attrs.get("income_type")

        if income_type == "SALARIED" and not attrs.get("employer_name"):
            raise serializers.ValidationError({
                "employer_name": "Employer name is required for salaried applicants."
            })

        if income_type == "SELF_EMPLOYED" and not attrs.get("business_name"):
            raise serializers.ValidationError({
                "business_name": "Business name is required for self-employed applicants."
            })

        return attrs

    # ------------------------------------------
    # AUTO-ASSIGN CREATED_BY
    # ------------------------------------------
    def create(self, validated_data):
        request = self.context.get("request")

        if request and request.user:
            validated_data["created_by"] = request.user

        return super().create(validated_data)