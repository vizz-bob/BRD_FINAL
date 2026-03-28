# from rest_framework import serializers
# from .models import CreditScoreRule, NegativeArea

# class CreditScoreRuleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CreditScoreRule
#         exclude = ('tenant',)
        
# class NegativeAreaSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NegativeArea
#         exclude = ('tenant',)


# risk_engine/serializers.py
# risk_engine/serializers.py
from rest_framework import serializers
from .models import CreditScoreRule, NegativeArea


from rest_framework import serializers
from .models import CreditScoreRule, NegativeArea


class CreditScoreRuleSerializer(serializers.ModelSerializer):
    # Explicit writable aliases
    score = serializers.IntegerField(source="impact_score", required=True)
    category = serializers.ChoiceField(
        choices=CreditScoreRule.EMPLOYMENT_TYPE_CHOICES,
        source="employment_type",
        required=True
    )

    PARAMETER_MAP = {
        "CIBIL Score": "CIBIL",
        "Salary": "SALARY",
        "Age": "AGE",
        "FOIR": "FOIR",
    }

    CONDITION_MAP = {
        "GREATER_THAN": "GT",
        "LESS_THAN": "LT",
        "BETWEEN": "BT",
    }

    REVERSE_PARAMETER_MAP = {v: k for k, v in PARAMETER_MAP.items()}
    REVERSE_CONDITION_MAP = {v: k for k, v in CONDITION_MAP.items()}

    class Meta:
        model = CreditScoreRule
        fields = [
            "id",
            "category",
            "parameter",
            "condition",
            "value",
            "score",
            "is_active",
            "created_at",
        ]

    def to_internal_value(self, data):
        data = data.copy()

        # Map parameter
        if data.get("parameter") in self.PARAMETER_MAP:
            data["parameter"] = self.PARAMETER_MAP[data["parameter"]]

        # Map condition
        if data.get("condition") in self.CONDITION_MAP:
            data["condition"] = self.CONDITION_MAP[data["condition"]]

        return super().to_internal_value(data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        rep["parameter"] = self.REVERSE_PARAMETER_MAP.get(
            instance.parameter, instance.parameter
        )
        rep["condition"] = self.REVERSE_CONDITION_MAP.get(
            instance.condition, instance.condition
        )

        return rep



class NegativeAreaSerializer(serializers.ModelSerializer):
    RISK_LEVEL_MAP = {
        "High": "HIGH",
        "Medium": "MEDIUM",
        "Low": "LOW",
        "Critical": "BLOCKED",
    }

    REVERSE_RISK_LEVEL_MAP = {
        "HIGH": "High",
        "MEDIUM": "Medium",
        "LOW": "Low",
        "BLOCKED": "Critical",
    }

    class Meta:
        model = NegativeArea
        fields = "__all__"

    def to_internal_value(self, data):
        data = data.copy()

        risk_level = data.get("risk_level")
        if risk_level in self.RISK_LEVEL_MAP:
            data["risk_level"] = self.RISK_LEVEL_MAP[risk_level]

        return super().to_internal_value(data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        rep["risk_level"] = self.REVERSE_RISK_LEVEL_MAP.get(
            instance.risk_level, instance.risk_level
        )

        return rep
