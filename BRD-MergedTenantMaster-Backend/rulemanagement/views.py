import uuid
import logging

# Configure logger
logger = logging.getLogger(__name__)

from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from tenants.models import Tenant
from .models import (
    RuleMaster, ImpactValue,
    ClientProfileRule,
    FinancialEligibilityRule,
    CollateralQualityRule,
    CreditHistoryRule,
    InternalScoreRule,
    GeoLocationRule,
    RiskMitigationRule,
    InternalVerificationRule,
    AgencyVerificationRule,
    TenantRuleConfig,
)
from .serializers import (
    RuleMasterSerializer,
    ImpactValueSerializer,
    ClientProfileRuleSerializer,
    FinancialEligibilityRuleSerializer,
    CollateralQualityRuleSerializer,
    CreditHistoryRuleSerializer,
    InternalScoreRuleSerializer,
    GeoLocationRuleSerializer,
    RiskMitigationRuleSerializer,
    InternalVerificationRuleSerializer,
    AgencyVerificationRuleSerializer,
    TenantRuleConfigSerializer,
)


# ─── Generic base viewset ───────────────────────────────────────────────────
class BaseRuleViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]


# ─── 1. Rule Master ─────────────────────────────────────────────────────────
class RuleMasterViewSet(BaseRuleViewSet):
    queryset = RuleMaster.objects.all().order_by("-created_at")
    serializer_class = RuleMasterSerializer


# ─── 1b. Impact Values ──────────────────────────────────────────────────────
class ImpactValueViewSet(BaseRuleViewSet):
    queryset = ImpactValue.objects.all().order_by("-created_at")
    serializer_class = ImpactValueSerializer


# ─── 2. Client Profile Rules ────────────────────────────────────────────────
class ClientProfileRuleViewSet(BaseRuleViewSet):
    queryset = ClientProfileRule.objects.all().order_by("-created_at")
    serializer_class = ClientProfileRuleSerializer


# ─── 3. Financial Eligibility ───────────────────────────────────────────────
class FinancialEligibilityRuleViewSet(BaseRuleViewSet):
    queryset = FinancialEligibilityRule.objects.all().order_by("-created_at")
    serializer_class = FinancialEligibilityRuleSerializer


# ─── 4. Collateral Quality ──────────────────────────────────────────────────
class CollateralQualityRuleViewSet(BaseRuleViewSet):
    queryset = CollateralQualityRule.objects.all().order_by("-created_at")
    serializer_class = CollateralQualityRuleSerializer


# ─── 5. Credit History ──────────────────────────────────────────────────────
class CreditHistoryRuleViewSet(BaseRuleViewSet):
    queryset = CreditHistoryRule.objects.all().order_by("-created_at")
    serializer_class = CreditHistoryRuleSerializer


# ─── 6. Internal Score ──────────────────────────────────────────────────────
class InternalScoreRuleViewSet(BaseRuleViewSet):
    queryset = InternalScoreRule.objects.all().order_by("-created_at")
    serializer_class = InternalScoreRuleSerializer


# ─── 7. Geo Location ────────────────────────────────────────────────────────
class GeoLocationRuleViewSet(BaseRuleViewSet):
    queryset = GeoLocationRule.objects.all().order_by("-created_at")
    serializer_class = GeoLocationRuleSerializer


# ─── 8. Risk Mitigation ─────────────────────────────────────────────────────
class RiskMitigationRuleViewSet(BaseRuleViewSet):
    queryset = RiskMitigationRule.objects.all().order_by("-created_at")
    serializer_class = RiskMitigationRuleSerializer


# ─── 9. Internal Verification ───────────────────────────────────────────────
class InternalVerificationRuleViewSet(BaseRuleViewSet):
    queryset = InternalVerificationRule.objects.all().order_by("-created_at")
    serializer_class = InternalVerificationRuleSerializer


# ─── 10. Agency Verification ────────────────────────────────────────────────
class AgencyVerificationRuleViewSet(BaseRuleViewSet):
    queryset = AgencyVerificationRule.objects.all().order_by("-created_at")
    serializer_class = AgencyVerificationRuleSerializer


# ─── Tenant Rules (for Rules.jsx config-blob endpoint) ──────────────────────
class TenantRulesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_id=None):
        logger.info(f"TenantRulesView.get called with tenant_id: {tenant_id}")
        
        if not tenant_id:
            logger.info("No tenant_id provided, looking for global config")
            rule = TenantRuleConfig.objects.filter(tenant__isnull=True).first()
            if rule:
                logger.info(f"Found global rule config: {rule.id}")
                return Response(TenantRuleConfigSerializer(rule).data)
            logger.info("No global rule config found")
            return Response({}, status=status.HTTP_200_OK)

        # Try to find tenant by UUID (tenant_id) or by integer ID
        tenant = None
        
        # First try integer ID lookup
        try:
            tenant = Tenant.objects.filter(id=int(tenant_id)).first()
            if tenant:
                logger.info(f"Found tenant by integer ID: {tenant.id}, name: {tenant.name}")
        except (ValueError, TypeError) as e:
            logger.info(f"Integer lookup failed: {e}")
        
        # If integer lookup fails, try UUID lookup
        if not tenant:
            try:
                # Try to convert to UUID
                uuid_obj = uuid.UUID(str(tenant_id))
                tenant = Tenant.objects.filter(tenant_id=uuid_obj).first()
                if tenant:
                    logger.info(f"Found tenant by UUID: {tenant.id}, name: {tenant.name}")
            except (ValueError, TypeError) as e:
                logger.info(f"UUID lookup failed: {e}")
        
        if not tenant:
            logger.warning(f"No tenant found for tenant_id: {tenant_id}")
            return Response({}, status=status.HTTP_200_OK)

        rule = TenantRuleConfig.objects.filter(tenant=tenant).first()
        if rule:
            logger.info(f"Found tenant rule config: {rule.id} for tenant: {tenant.name}")
            return Response(TenantRuleConfigSerializer(rule).data)
        else:
            logger.info(f"No rule config found for tenant: {tenant.name}")
            return Response({}, status=status.HTTP_200_OK)

    def post(self, request, tenant_id=None):
        logger.info(f"TenantRulesView.post called with tenant_id: {tenant_id}")
        config = request.data.get("config")
        logger.info(f"Config data received: {config}")
        
        if not config:
            logger.error("No config provided in request")
            return Response({"detail": "Config is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not tenant_id:
            logger.info("No tenant_id provided, creating global config")
            rule, _ = TenantRuleConfig.objects.update_or_create(
                tenant__isnull=True,
                defaults={"tenant": None, "config": config}
            )
            logger.info(f"Created/updated global rule config: {rule.id}")
            return Response(TenantRuleConfigSerializer(rule).data)

        # Try to find tenant by UUID (tenant_id) or by integer ID
        tenant = None
        
        # First try integer ID lookup
        try:
            tenant = Tenant.objects.filter(id=int(tenant_id)).first()
            if tenant:
                logger.info(f"Found tenant by integer ID: {tenant.id}, name: {tenant.name}")
        except (ValueError, TypeError) as e:
            logger.info(f"Integer lookup failed: {e}")
        
        # If integer lookup fails, try UUID lookup
        if not tenant:
            try:
                # Try to convert to UUID
                uuid_obj = uuid.UUID(str(tenant_id))
                tenant = Tenant.objects.filter(tenant_id=uuid_obj).first()
                if tenant:
                    logger.info(f"Found tenant by UUID: {tenant.id}, name: {tenant.name}")
            except (ValueError, TypeError) as e:
                logger.info(f"UUID lookup failed: {e}")
        
        if not tenant:
            logger.error(f"No tenant found for tenant_id: {tenant_id}")
            return Response({"detail": "Invalid tenant"}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"Creating/updating rule config for tenant: {tenant.name}")
        rule, created = TenantRuleConfig.objects.update_or_create(
            tenant=tenant,
            defaults={"config": config}
        )
        
        if created:
            logger.info(f"Created new rule config: {rule.id} for tenant: {tenant.name}")
        else:
            logger.info(f"Updated existing rule config: {rule.id} for tenant: {tenant.name}")
        
        logger.info(f"Rule config data: {rule.config}")
        
        # --- EXHAUSTIVE SYNC TO BACKEND ADMIN MODELS ---
        try:
            risk_engine = config.get("riskEngine", {})
            if risk_engine:
                logger.info("Syncing riskEngine config to Backend Admin Rule Management Models")
                raw_name = risk_engine.get("ruleName")
                rule_name = raw_name.strip() if raw_name and str(raw_name).strip() else "Default Risk Rule"
                rule_type = risk_engine.get("ruleType", "knockout")
                product = risk_engine.get("product", "All")
                segment = risk_engine.get("segment", "All")
                
                # 1. RuleMaster
                RuleMaster.objects.update_or_create(
                    rule_name=rule_name,
                    defaults={
                        "rule_code": "RISK", 
                        "status": "Active",
                        "rule_type": rule_type,
                        "product": product,
                        "segment": segment,
                        "description": f"Published from riskEngine Dashboard"
                    }
                )
                
                # 2. Impact Value
                impact_val = risk_engine.get("impactValue")
                if impact_val:
                    ImpactValue.objects.update_or_create(
                        label=rule_name[:100],
                        defaults={"value": str(impact_val), "status": "Active"}
                    )
                
                # 3. Client Profile Rules (Multiple entries for full coverage)
                # Age
                age_min = risk_engine.get("ageMin")
                age_max = risk_engine.get("ageMax")
                if age_min or age_max:
                    ClientProfileRule.objects.update_or_create(
                        rule_name=f"{rule_name} - Applicant Age",
                        defaults={"parameter": "Applicant Age", "condition": "Between", "value": f"{age_min} - {age_max}", "status": "ACTIVE"}
                    )
                
                co_age_min = risk_engine.get("coAgeMin")
                co_age_max = risk_engine.get("coAgeMax")
                if co_age_min or co_age_max:
                    ClientProfileRule.objects.update_or_create(
                        rule_name=f"{rule_name} - Co-Applicant Age",
                        defaults={"parameter": "Co-Applicant Age", "condition": "Between", "value": f"{co_age_min} - {co_age_max}", "status": "ACTIVE"}
                    )

                # Employment
                emp_types = risk_engine.get("employerTypes", [])
                if emp_types:
                    ClientProfileRule.objects.update_or_create(
                        rule_name=f"{rule_name} - Employer Types",
                        defaults={"parameter": "Employer Types", "condition": "In", "value": ", ".join(emp_types), "status": "ACTIVE"}
                    )
                
                bus_age = risk_engine.get("businessAge")
                if bus_age:
                    ClientProfileRule.objects.update_or_create(
                        rule_name=f"{rule_name} - Business Age",
                        defaults={"parameter": "Min Business Age", "condition": "GTE", "value": str(bus_age), "status": "ACTIVE"}
                    )
                
                sectors = risk_engine.get("selectedSectors", [])
                if sectors:
                    ClientProfileRule.objects.update_or_create(
                        rule_name=f"{rule_name} - Allowed Sectors",
                        defaults={"parameter": "Business Sectors", "condition": "In", "value": ", ".join(sectors), "status": "ACTIVE"}
                    )
                
                # Location
                addr = risk_engine.get("addressCriteria")
                if addr:
                    ClientProfileRule.objects.update_or_create(
                        rule_name=f"{rule_name} - Address Criteria",
                        defaults={"parameter": "Address Match", "condition": "Equal", "value": addr, "status": "ACTIVE"}
                    )
                
                # 4. Financial Eligibility Rule
                FinancialEligibilityRule.objects.update_or_create(
                    income_type="RiskEngine Compound",
                    defaults={
                        "min_monthly_income": float(risk_engine.get('minSalary') or 0),
                        "min_business_income": float(risk_engine.get('minBusiness') or 0),
                        "min_annual_turnover": float(risk_engine.get('minTurnover') or 0),
                        "min_bank_balance": float(risk_engine.get('minBank') or 0),
                        "cash_flow_threshold": float(risk_engine.get('cashFlowValue') or 0),
                        "max_emi_ratio": str(risk_engine.get('foir') or "0"),
                        "itr_required": bool(risk_engine.get('itrToggle')),
                        "cash_flow_check": bool(risk_engine.get('cashFlowToggle')),
                        "compliance_check": bool(risk_engine.get('complianceToggle')),
                        "status": "ACTIVE",
                        "remarks": f"Exhaustive sync from UI"
                    }
                )

                # 4b. Collateral Quality Rule
                if risk_engine.get("collateralRelevance"):
                    CollateralQualityRule.objects.update_or_create(
                        collateral_type="General Property",
                        defaults={
                            "ownership": str(risk_engine.get("ownershipVerification", "Any")),
                            "min_market_value": float(risk_engine.get("minEstimatedValue") or 0),
                            "allowed_ltv": str(risk_engine.get("maxLtvRatio", "0")),
                            "risk_level": str(risk_engine.get("collateralRelevance")),
                            "status": "ACTIVE"
                        }
                    )
                
                # 4c. Geo Location Rules
                for area in risk_engine.get("negativeAreas", []):
                    if str(area).strip():
                        GeoLocationRule.objects.update_or_create(
                            pincode=int(area) if str(area).isdigit() else 0,
                            defaults={"state": "All", "city": "All", "risk_level": "High - Blocked", "status": "ACTIVE", "remarks": "Blacklisted Pincode"}
                        )
                
                # 5. Risk Mitigation Rules
                risks = risk_engine.get("risks", [])
                for r in risks:
                    t = r.get("type")
                    if t:
                        RiskMitigationRule.objects.update_or_create(
                            risk_parameter=t[:255],
                            defaults={
                                "mitigation_action": r.get("mitigation", ""),
                                "severity": "High",
                                "status": "ACTIVE"
                            }
                        )

                # 6. Credit History Rules
                rows = risk_engine.get("rows", [])
                for idx, r in enumerate(rows):
                    bureau = r.get("bureau")
                    if bureau:
                        score = r.get("minScore")
                        max_enq = r.get("maxEnquiries")
                        max_del = r.get("maxDelayed")
                        CreditHistoryRule.objects.update_or_create(
                            credit_bureau=f"{bureau} - {rule_name}"[:100],
                            defaults={
                                "min_credit_score": int(score) if str(score).isdigit() else 0,
                                "max_enquiries": int(max_enq) if str(max_enq).isdigit() else 0,
                                "max_dpd_days": int(max_del) if str(max_del).isdigit() else 0,
                                "status": "ACTIVE",
                                "risk_level": "Medium"
                            }
                        )

                # 6b. Internal Scorecard Rules
                personas = risk_engine.get("personas", [])
                for p in personas:
                    if p.get("name"):
                        InternalScoreRule.objects.update_or_create(
                            parameter=f"{p.get('name')} - {rule_name}"[:100],
                            defaults={
                                "min_value": float(p.get("minScore") or 0),
                                "weight": float(p.get("weight") or 0),
                                "risk_level": "Dynamic Scorecard",
                                "status": "ACTIVE"
                            }
                        )

                # 7. Verification Rules
                internal_verif = risk_engine.get("internalVerif", True)
                if internal_verif:
                    # Lookup by partial match of rule_name to keep it stable
                    v_type_raw = risk_engine.get('internalVerifType', 'Internal')
                    v_type = f"{v_type_raw} - {rule_name}"[:255]
                    
                    # Convert TAT safely
                    tat_val = risk_engine.get('internalTat')
                    tat = int(tat_val) if str(tat_val).isdigit() else 2
                    
                    InternalVerificationRule.objects.update_or_create(
                        verification_type=v_type,
                        defaults={
                            "criteria": "Comprehensive System Verification",
                            "turnaround_days": tat,
                            "flag_mismatch": risk_engine.get('mismatchFlag', True) is True,
                            "flag_duplicate_pan": risk_engine.get('dupPan', True) is True,
                            "status": "ACTIVE"
                        }
                    )
                
                if risk_engine.get("agencyVerif"):
                    AgencyVerificationRule.objects.update_or_create(
                        agency_type=f"{str(risk_engine.get('agencyName') or 'Third-Party')} - {rule_name}"[:255],
                        defaults={
                            "agency_name": str(risk_engine.get('agencyName') or 'N/A'),
                            "agency_level": str(risk_engine.get('agencyLevel') or 'Basic'),
                            "verification_stage": "External Partner Check",
                            "status": "ACTIVE",
                            "remarks": "Sync from UI RiskEngine Dashboard"
                        }
                    )
        except Exception as ex:
            logger.error(f"Error syncing risk engine to models: {ex}")
        # ----------------------------------------------

        return Response(TenantRuleConfigSerializer(rule).data)


# ─── Debug Endpoint for Testing ─────────────────────────────────────────────
class DebugDataView(APIView):
    permission_classes = []  # No authentication for debugging
    
    def get(self, request):
        """Debug endpoint to check data storage"""
        from tenants.models import Tenant
        from .models import TenantRuleConfig
        
        # Check tenants
        tenants = Tenant.objects.all()
        tenant_list = []
        for tenant in tenants:
            tenant_list.append({
                'id': str(tenant.id),
                'tenant_id': str(tenant.tenant_id),
                'name': tenant.name
            })
        
        # Check rule configs
        configs = TenantRuleConfig.objects.all()
        config_list = []
        for config in configs:
            config_list.append({
                'id': str(config.id),
                'tenant': config.tenant.name if config.tenant else None,
                'tenant_id': str(config.tenant.id) if config.tenant else None,
                'config': config.config,
                'created_at': config.created_at.isoformat(),
                'updated_at': config.updated_at.isoformat()
            })
        
        # Create test tenant if none exist
        if not tenants:
            try:
                test_tenant = Tenant.objects.create(
                    name="Test Tenant",
                    email="test@example.com",
                    tenant_type="BANK"
                )
                tenant_list.append({
                    'id': str(test_tenant.id),
                    'tenant_id': str(test_tenant.tenant_id),
                    'name': test_tenant.name
                })
            except Exception as e:
                return Response({
                    'error': f'Failed to create test tenant: {str(e)}',
                    'tenants': tenant_list,
                    'configs': config_list
                })
        
        return Response({
            'tenants': tenant_list,
            'configs': config_list,
            'total_tenants': len(tenant_list),
            'total_configs': len(config_list)
        })
