from decimal import Decimal
from datetime import date

from django.apps import apps

MortgageUnderwriting = apps.get_model(
    "los", "MortgageUnderwriting"
)


class RuleEngine:
    """
    Central rule engine for LOS eligibility & underwriting.
    """

    def __init__(self, application):
        self.app = application
        self.product = application.product
        self.config = self.product.configuration if self.product else {}

        self.constraints = self.config.get("constraints", {})
        self.foir_config = self.config.get("foir", {})
        self.ltv_config = self.config.get("ltv", {})

    # ======================================================
    # AGE CALCULATION
    # ======================================================
    def _calculate_age(self):
        today = date.today()
        dob = self.app.dob
        return today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )

    # ======================================================
    # KNOCKOUT CHECKS
    # ======================================================
    def run_knockout_checks(self):
        result = {
            "is_eligible": True,
            "rejection_reason": None,
            "flags": {}
        }

        # AGE CHECK
        age = self._calculate_age()
        min_age = self.constraints.get("min_age", 21)
        max_age = self.constraints.get("max_age", 65)

        if not (min_age <= age <= max_age):
            return {
                "is_eligible": False,
                "rejection_reason": f"Age {age} not in allowed range",
                "flags": {"AGE_FAIL": True}
            }

        # GEO CHECK
        if not self.app.is_geo_limit_passed:
            return {
                "is_eligible": False,
                "rejection_reason": "Residence location not serviceable",
                "flags": {"GEO_FAIL": True}
            }

        # NEGATIVE AREA CHECK
        if self.app.is_residence_negative_area:
            return {
                "is_eligible": False,
                "rejection_reason": "Residence in negative area",
                "flags": {"NEGATIVE_AREA": True}
            }

        return result

    # ======================================================
    # UNDERWRITING CALCULATION
    # ======================================================
    def calculate_underwriting(self):
        """
        FOIR + LTV + System Decision
        """

        monthly_income = Decimal(self.app.monthly_income or 0)
        existing_obligations = Decimal(
            getattr(self.app, "existing_obligations", 0)
        )

        allowed_foir = Decimal(
            self.foir_config.get("max_percentage", 50)
        )

        foir_percentage = Decimal("0.00")
        net_cash_flow = Decimal("0.00")

        # --------------------------------------------------
        # FOIR CALCULATION
        # --------------------------------------------------
        if monthly_income > 0:
            foir_percentage = (
                existing_obligations / monthly_income
            ) * 100

            max_emi_allowed = (monthly_income * allowed_foir) / Decimal(100)
            net_cash_flow = max_emi_allowed - existing_obligations
        else:
            foir_percentage = Decimal("100.00")

        # --------------------------------------------------
        # MORTGAGE LOAN (LTV CHECK)
        # --------------------------------------------------
        if self.app.is_mortgage_loan():

            property_detail = getattr(self.app, "property_detail", None)

            if not property_detail:
                return self._reject("Property details missing")

            valuation_report = property_detail.reports.filter(
                report_type="VALUATION",
                status="APPROVED"
            ).first()

            if not valuation_report:
                return self._reject("Approved valuation report missing")

            property_value = valuation_report.market_value
            max_ltv = Decimal(self.ltv_config.get("max_percentage", 60))

            eligible_amount = (
                property_value * max_ltv
            ) / Decimal(100)

            # Save mortgage underwriting
            MortgageUnderwriting.objects.update_or_create(
                loan_application=self.app,
                defaults={
                    "property_market_value": property_value,
                    "ltv_on_property": max_ltv,
                    "final_eligible_amount": eligible_amount,
                }
            )

            if self.app.requested_amount > eligible_amount:
                return self._reject("Requested amount exceeds LTV eligibility")

        # --------------------------------------------------
        # FINAL SYSTEM DECISION
        # --------------------------------------------------
        decision = "APPROVE"

        if foir_percentage > allowed_foir or net_cash_flow <= 0:
            decision = "REJECT"

        return {
            "monthly_income": monthly_income,
            "existing_obligations": existing_obligations,
            "allowed_foir": allowed_foir,
            "foir_percentage": foir_percentage.quantize(Decimal("0.01")),
            "net_cash_flow": net_cash_flow.quantize(Decimal("0.01")),
            "system_decision": decision
        }

    # ======================================================
    # HELPER: REJECT RESPONSE
    # ======================================================
    def _reject(self, reason):
        return {
            "monthly_income": Decimal("0.00"),
            "existing_obligations": Decimal("0.00"),
            "allowed_foir": Decimal("0.00"),
            "foir_percentage": Decimal("100.00"),
            "net_cash_flow": Decimal("0.00"),
            "system_decision": "REJECT",
            "reason": reason,
        }
