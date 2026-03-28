from rest_framework import viewsets
from .models import (
    RuleIdentification,
    ClientProfileRule,
    FinancialEligibilityRule,
    CollateralQualityRule,
    AutomatedScorecard,
    AgencyVerificationRule
)
from .serializers import (
    RuleIdentificationSerializer,
    ClientProfileRuleSerializer,
    FinancialEligibilityRuleSerializer,
    CollateralQualityRuleSerializer,
    AutomatedScorecardSerializer,
    AgencyVerificationRuleSerializer
)


class RuleIdentificationViewSet(viewsets.ModelViewSet):
    queryset = RuleIdentification.objects.all()
    serializer_class = RuleIdentificationSerializer


class ClientProfileRuleViewSet(viewsets.ModelViewSet):
    queryset = ClientProfileRule.objects.all()
    serializer_class = ClientProfileRuleSerializer


class FinancialEligibilityRuleViewSet(viewsets.ModelViewSet):
    queryset = FinancialEligibilityRule.objects.all()
    serializer_class = FinancialEligibilityRuleSerializer


class CollateralQualityRuleViewSet(viewsets.ModelViewSet):
    queryset = CollateralQualityRule.objects.all()
    serializer_class = CollateralQualityRuleSerializer


class AutomatedScorecardViewSet(viewsets.ModelViewSet):
    queryset = AutomatedScorecard.objects.all()
    serializer_class = AutomatedScorecardSerializer


class AgencyVerificationRuleViewSet(viewsets.ModelViewSet):
    queryset = AgencyVerificationRule.objects.all()
    serializer_class = AgencyVerificationRuleSerializer