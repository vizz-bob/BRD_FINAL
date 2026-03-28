from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *
from .permissions import IsMasterAdmin


class BaseRuleView(ModelViewSet):
    permission_classes = [IsMasterAdmin]


class RuleMasterView(BaseRuleView):
    queryset = RuleMaster.objects.all()
    serializer_class = RuleMasterSerializer


class ImpactValueView(BaseRuleView):
    queryset = ImpactValue.objects.all()
    serializer_class = ImpactValueSerializer


class ClientProfileRuleView(BaseRuleView):
    queryset = ClientProfileRule.objects.all()
    serializer_class = ClientProfileRuleSerializer


class CollateralQualityRuleView(BaseRuleView):
    queryset = CollateralQualityRule.objects.all()
    serializer_class = CollateralQualityRuleSerializer


class FinancialEligibilityRuleView(BaseRuleView):
    queryset = FinancialEligibilityRule.objects.all()
    serializer_class = FinancialEligibilityRuleSerializer


class CreditHistoryRuleView(BaseRuleView):
    queryset = CreditHistoryRule.objects.all()
    serializer_class = CreditHistoryRuleSerializer


class InternalScoreRuleView(BaseRuleView):
    queryset = InternalScoreRule.objects.all()
    serializer_class = InternalScoreRuleSerializer
    lookup_field = "id"



class GeoLocationRuleView(BaseRuleView):
    queryset = GeoLocationRule.objects.all()
    serializer_class = GeoLocationRuleSerializer


class RiskMitigationRuleView(BaseRuleView):
    queryset = RiskMitigationRule.objects.all()
    serializer_class = RiskMitigationRuleSerializer


class InternalVerificationRuleView(BaseRuleView):
    queryset = InternalVerificationRule.objects.all()
    serializer_class = InternalVerificationRuleSerializer


class AgencyVerificationRuleView(BaseRuleView):
    queryset = AgencyVerificationRule.objects.all()
    serializer_class = AgencyVerificationRuleSerializer
