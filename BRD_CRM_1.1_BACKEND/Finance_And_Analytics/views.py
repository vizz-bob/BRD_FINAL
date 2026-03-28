from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import (
    LoanAccount,
    Repayment,
    CollectionBucket,
    PromiseToPay,
    InteractionLog,
    RecoveryCase,
    Forecast,
    Campaign,
    Lead,
    AgentTarget,
    Target,
    SettlementDocument,
    ActivityTarget,
    ConversionTarget,
    CampaignROI,
    TargetHistory,
)
from .serializers import (
    RepaymentSerializer,
    LoanLedgerSerializer,
    CollectionBucketSerializer,
    PromiseToPaySerializer,
    InteractionLogSerializer,
    RecoveryCaseSerializer,
    SettlementDocumentSerializer,
    ForecastSerializer,
    TrendPointSerializer,
    CampaignBreakdownSerializer,
    AgentPerformanceSerializer,
    TargetSerializer,
    ActivityTargetSerializer,
    ConversionTargetSerializer,
    CampaignROISerializer,
    TargetHistorySerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from Finance_And_Analytics.services import send_whatsapp, send_sms, trigger_ivr
from django.utils import timezone


class LoanLedgerViewSet(ModelViewSet):
    queryset = LoanAccount.objects.all().prefetch_related("repayments")
    serializer_class = LoanLedgerSerializer
    # permission_classes = [IsAuthenticated] # Temporarily disabled for testing


class RepaymentViewSet(ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer

    # permission_classes = [IsAuthenticated] # Temporarily disabled for testing
    @action(detail=True, methods=["post"], url_path="upload-receipt")
    def upload_receipt(self, request, pk=None):
        repayment = self.get_object()

        file = request.FILES.get("receipt")
        transaction_id = request.data.get("transaction_id")

        if not file:
            return Response(
                {"error": "Receipt file required"}, status=status.HTTP_400_BAD_REQUEST
            )

        repayment.receipt = file
        repayment.transaction_id = transaction_id
        repayment.status = "PAID"
        repayment.save()

        return Response({"message": "Receipt uploaded successfully"})


class CollectionBucketViewSet(ModelViewSet):
    queryset = CollectionBucket.objects.all()
    serializer_class = CollectionBucketSerializer

    def list(self, request):
        data = []

        buckets = (
            CollectionBucket.objects.select_related("loan")
            .prefetch_related("ptps", "interactions", "loan__repayments")
            .order_by("-updated_at")
        )

        today = timezone.now().date()

        for bucket in buckets:
            loan = bucket.loan

            # 🔹 Oldest unpaid EMI
            oldest_unpaid = (
                loan.repayments.filter(status__in=["UNPAID", "PARTIAL"])
                .order_by("due_date")
                .first()
            )

            if oldest_unpaid:
                dpd_days = (today - oldest_unpaid.due_date).days
                dpd = f"{dpd_days} Days" if dpd_days > 0 else "0 Days"
            else:
                dpd = "0 Days"

            # 🔹 Latest PTP
            ptp = bucket.ptps.order_by("-created_at").first()
            ptp_date = ptp.commit_date.strftime("%d %b") if ptp else "None"

            # 🔹 Latest Interaction
            interaction = bucket.interactions.order_by("-created_at").first()
            last_outcome = interaction.outcome if interaction else "No Interaction"

            data.append(
                {
                    "id": bucket.id,
                    "loan_no": loan.loan_number,
                    "name": loan.borrower_name,
                    "dpd": dpd,
                    "overdue": f"₹{bucket.total_overdue:,.0f}",
                    "ptp": ptp_date,
                    "lastOutcome": last_outcome,
                }
            )

        return Response(data)

    @action(detail=True, methods=["post"], url_path="trigger")
    def trigger_action(self, request, pk=None):
        bucket = self.get_object()
        loan = bucket.loan

        action_type = request.data.get("type")  # whatsapp / sms / call
        phone = request.data.get("phone")

        if action_type == "whatsapp":
            send_whatsapp(phone, f"Your EMI is overdue for {loan.loan_number}")
        elif action_type == "sms":
            send_sms(phone, f"EMI pending for loan {loan.loan_number}")
        elif action_type == "call":
            trigger_ivr(phone)
        else:
            return Response({"error": "Invalid trigger type"}, status=400)

        return Response({"status": "triggered"})

    @action(detail=True, methods=["post"], url_path="escalate")
    def escalate_to_recovery(self, request, pk=None):
        bucket = self.get_object()
        loan = bucket.loan

        recovery, created = RecoveryCase.objects.get_or_create(
            loan=loan,
            defaults={
                "stage": "LEGAL",
                "assigned_agent": (
                    request.user if request.user.is_authenticated else None
                ),
            },
        )

        return Response(
            {"message": "Escalated to recovery", "recovery_id": recovery.id}
        )


class PromiseToPayViewSet(ModelViewSet):
    queryset = PromiseToPay.objects.all()
    serializer_class = PromiseToPaySerializer
    permission_classes = [IsAuthenticated]


class InteractionLogViewSet(ModelViewSet):
    queryset = InteractionLog.objects.all()
    serializer_class = InteractionLogSerializer
    permission_classes = [IsAuthenticated]


class RecoveryCaseViewSet(ModelViewSet):
    queryset = RecoveryCase.objects.all()
    serializer_class = RecoveryCaseSerializer

    # permission_classes = [IsAuthenticated] # Temporarily disabled for testing
    def list(self, request):
        cases = RecoveryCase.objects.select_related("loan", "assigned_agent")

        data = []

        for case in cases:

            # Calculate total overdue from unpaid repayments
            overdue = (
                case.loan.repayments.filter(status__in=["UNPAID", "PARTIAL"]).aggregate(
                    total=Sum("amount_due")
                )["total"]
                or 0
            )

            # Latest interaction
            last_interaction = case.loan.interactions.order_by("-created_at").first()

            data.append(
                {
                    "id": case.id,
                    "loan_no": case.loan.loan_number,
                    "name": case.loan.borrower_name,
                    "stage": case.get_stage_display(),
                    "status": "Settled" if case.stage == "SETTLED" else "In Progress",
                    "overdue": f"₹{overdue}",
                    "escalatedOn": case.updated_at.strftime("%d %b %Y"),
                    "assignedAgent": (
                        case.assigned_agent.username
                        if case.assigned_agent
                        else "Unassigned"
                    ),
                    "lastAction": (
                        last_interaction.created_at.strftime("%d %b %Y")
                        if last_interaction
                        else "N/A"
                    ),
                    "followUpDate": (
                        case.follow_up_date.strftime("%d %b %Y")
                        if case.follow_up_date
                        else "Closed"
                    ),
                }
            )

        return Response(data)

    @action(detail=True, methods=["post"], url_path="upload-document")
    def upload_document(self, request, pk=None):
        recovery = self.get_object()
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "File required"}, status=400)

        SettlementDocument.objects.create(recovery=recovery, file=file)

        return Response({"message": "Document uploaded"})

    @action(detail=True, methods=["post"], url_path="mark-settled")
    def mark_settled(self, request, pk=None):
        recovery = self.get_object()

        recovery.stage = "SETTLED"
        recovery.settlement_notes = request.data.get("summary", "")
        recovery.save()

        return Response({"status": "Loan settled"})


from django.db.models import Sum, Count
from django.db.models.functions import TruncWeek, TruncMonth
from datetime import date
from qualified_leads.models import QualifiedLead
from pipeline.models import RawLead, FollowUp, LoanApplication
from hot_lead.models import HotLead


class ForecastViewSet(viewsets.ModelViewSet):
    queryset = Forecast.objects.all().order_by("-created_at")
    serializer_class = ForecastSerializer
    # permission_classes = [IsAuthenticated]  # Temporarily disabled for testing

    def _build_agent_performance_rows(self):
        forecast_lookup = {
            forecast.id: forecast
            for forecast in Forecast.objects.all()
        }
        agent_rows = {}

        for target in AgentTarget.objects.select_related("agent", "forecast"):
            username = target.agent.username
            if username not in agent_rows:
                agent_rows[username] = {
                    "agent": username,
                    "team": "Sales",
                    "target": 0.0,
                    "achieved": 0.0,
                    "achievement_percent": 0.0,
                    "variance": 0.0,
                    "expected_deals": 0,
                    "status": "Behind Target",
                    "last_updated": target.updated_at.strftime("%Y-%m-%d %H:%M"),
                    "forecast_ids": set(),
                }

            agent_rows[username]["forecast_ids"].add(target.forecast_id)
            agent_rows[username]["last_updated"] = target.updated_at.strftime(
                "%Y-%m-%d %H:%M"
            )

        for lead in Lead.objects.select_related("assigned_agent", "forecast").filter(
            assigned_agent__isnull=False
        ):
            username = lead.assigned_agent.username
            if username not in agent_rows:
                agent_rows[username] = {
                    "agent": username,
                    "team": "Sales",
                    "target": 0.0,
                    "achieved": 0.0,
                    "achievement_percent": 0.0,
                    "variance": 0.0,
                    "expected_deals": 0,
                    "status": "Behind Target",
                    "last_updated": lead.created_at.strftime("%Y-%m-%d %H:%M"),
                    "forecast_ids": set(),
                }

            agent_rows[username]["achieved"] += float(lead.expected_value or 0)
            agent_rows[username]["forecast_ids"].add(lead.forecast_id)
            if lead.stage == "HOT":
                agent_rows[username]["expected_deals"] += 1
            if (
                lead.created_at.strftime("%Y-%m-%d %H:%M")
                > agent_rows[username]["last_updated"]
            ):
                agent_rows[username]["last_updated"] = lead.created_at.strftime(
                    "%Y-%m-%d %H:%M"
                )

        rows = []
        for row in agent_rows.values():
            target_total = 0.0
            for forecast_id in row.pop("forecast_ids"):
                forecast = forecast_lookup.get(forecast_id)
                if forecast:
                    target_total += float(forecast.target_revenue or 0)

            achieved = row["achieved"]
            percent = (achieved / target_total * 100) if target_total else 0.0
            variance = achieved - target_total

            if percent >= 90:
                status_label = "On Track"
            elif percent >= 60:
                status_label = "Needs Attention"
            else:
                status_label = "Behind Target"

            row["target"] = round(target_total, 2)
            row["achievement_percent"] = round(percent, 1)
            row["variance"] = round(float(variance), 2)
            row["status"] = status_label
            rows.append(row)

        rows.sort(key=lambda item: item["agent"].lower())
        return rows

    @action(detail=False, methods=["get"])
    def overview(self, request):

        expected_deals = HotLead.objects.count()

        projected_revenue = float(
            LoanApplication.objects.aggregate(total=Sum("requested_amount"))["total"]
            or 0
        )

        target_revenue = float(
            Forecast.objects.aggregate(total=Sum("target_revenue"))["total"] or 0
        )

        achievement_rate = (
            (projected_revenue / target_revenue * 100) if target_revenue > 0 else 0
        )

        return Response(
            {
                "expected_deals": expected_deals,
                "projected_revenue": projected_revenue,
                "target_revenue": target_revenue,
                "achievement_rate": round(achievement_rate, 2),
                "active_forecasts": Forecast.objects.count(),
            }
        )

    @action(detail=False, methods=["get"])
    def trends(self, request):

        period = request.query_params.get("period", "WEEKLY")

        qs = RawLead.objects.filter(updated_at__isnull=False)

        if period == "WEEKLY":
            qs = qs.annotate(p=TruncWeek("updated_at"))
        else:
            qs = qs.annotate(p=TruncMonth("updated_at"))

        trend = qs.values("p").annotate(value=Count("id")).order_by("p")

        return Response(
            [
                {"label": str(i["p"].date()), "value": i["value"], "target": 0}
                for i in trend
            ]
        )

    @action(detail=False, methods=["get"])
    def campaign_breakdown(self, request):

        data = RawLead.objects.values("vendor_source").annotate(leads=Count("id"))

        return Response(
            [
                {
                    "campaign": i["vendor_source"] or "Unknown",
                    "leads": i["leads"],
                    "revenue": 0,
                }
                for i in data
            ]
        )

    @action(detail=False, methods=["get"])
    def lead_funnel(self, request):

        raw = RawLead.objects.count()
        qualified = QualifiedLead.objects.count()
        hot = HotLead.objects.count()
        follow_up = FollowUp.objects.count()
        deals = LoanApplication.objects.count()

        return Response(
            {
                "rawLeads": raw,
                "qualifiedLeads": qualified,
                "hotLeads": hot,
                "followUp": follow_up,
                "deals": deals,
            }
        )

    @action(detail=False, methods=["get"])
    def agent_performance(self, request):
        return Response(self._build_agent_performance_rows())

    @action(detail=False, methods=["get"])
    def export_agents(self, request):
        from Finance_And_Analytics.utils import export_csv, export_excel

        fmt = request.query_params.get("export_format", "csv")
        include_details = (
            str(request.query_params.get("include_details", "true")).lower() == "true"
        )
        rows = []
        performance_rows = self._build_agent_performance_rows()

        if performance_rows:
            for row in performance_rows:
                if include_details:
                    rows.append(
                        [
                            row["agent"],
                            row["team"],
                            row["agent"],
                            "MULTI",
                            row["target"],
                            row["achieved"],
                            row["achievement_percent"],
                            row["variance"],
                            row["expected_deals"],
                            row["status"],
                            row["last_updated"],
                        ]
                    )
                else:
                    rows.append(
                        [
                            row["agent"],
                            row["target"],
                            row["achieved"],
                            row["achievement_percent"],
                        ]
                    )
        else:
            for forecast in Forecast.objects.all().order_by("start_date", "name"):
                if include_details:
                    rows.append(
                        [
                            forecast.name,
                            forecast.period,
                            forecast.name,
                            forecast.period,
                            float(forecast.target_revenue),
                            0,
                            0,
                            -float(forecast.target_revenue),
                            0,
                            "Behind Target",
                            forecast.created_at.strftime("%Y-%m-%d %H:%M"),
                        ]
                    )
                else:
                    rows.append(
                        [
                            forecast.name,
                            float(forecast.target_revenue),
                            0,
                            0,
                        ]
                    )

        headers = (
            [
                "Agent",
                "Team",
                "Forecast",
                "Period",
                "Target",
                "Achieved",
                "Achievement %",
                "Variance",
                "Expected Deals",
                "Status",
                "Last Updated",
            ]
            if include_details
            else ["Agent", "Target", "Achieved", "Achievement %"]
        )
        if fmt == "excel":
            return export_excel("agent_performance", headers, rows)
        return export_csv("agent_performance", headers, rows)

    @action(detail=False, methods=["get"])
    def export_campaigns(self, request):
        from Finance_And_Analytics.utils import export_csv, export_excel

        fmt = request.query_params.get("export_format", "csv")
        data = Lead.objects.values("vendor_source").annotate(
            leads=Count("id"), revenue=Sum("expected_value")
        )
        rows = [[i["vendor_source"], i["leads"], i["revenue"]] for i in data]
        headers = ["Campaign", "Leads", "Revenue"]
        if fmt == "excel":
            return export_excel("campaign_breakdown", headers, rows)
        return export_csv("campaign_breakdown", headers, rows)


class TargetViewSet(viewsets.ModelViewSet):
    queryset = Target.objects.all().order_by("-created_at")
    serializer_class = TargetSerializer

    # ---------- OVERVIEW ----------
    @action(detail=False, methods=["get"])
    def overview(self, request):
        financial_targets = Target.objects.filter(target_type="financial")

        target_sum = (
            financial_targets.aggregate(total=Sum("target_value"))["total"] or 0
        )

        achieved_sum = (
            financial_targets.aggregate(total=Sum("achieved_value"))["total"] or 0
        )

        achievement = round((achieved_sum / target_sum) * 100, 2) if target_sum else 0

        variance = round(target_sum - achieved_sum, 2)

        status_label = (
            "On Track"
            if achievement >= 100
            else "At Risk" if achievement >= 80 else "Behind Target"
        )

        return Response(
            {
                "target": target_sum,
                "achieved": achieved_sum,
                "achievement_percent": achievement,
                "variance": variance,
                "status": status_label,
            }
        )


class ActivityTargetViewSet(viewsets.ModelViewSet):
    queryset = ActivityTarget.objects.select_related("target")
    serializer_class = ActivityTargetSerializer

    @action(detail=False, methods=["get"])
    def summary(self, request):
        data = []

        for activity in self.get_queryset():
            data.append(
                {
                    "activity": activity.activity_type,
                    "target": activity.target_count,
                    "achieved": activity.achieved_count,
                    "progress": activity.progress,
                    "status": (
                        "On Track" if activity.progress >= 70 else "Behind Target"
                    ),
                }
            )

        return Response(data)


class ConversionTargetViewSet(viewsets.ModelViewSet):
    queryset = ConversionTarget.objects.select_related("target")
    serializer_class = ConversionTargetSerializer

    @action(detail=False, methods=["get"])
    def summary(self, request):
        results = []

        for conv in self.get_queryset():
            results.append(
                {
                    "stage": f"{conv.stage_from} → {conv.stage_to}",
                    "target_rate": conv.target_rate,
                    "actual_rate": conv.actual_rate,
                    "achievement": conv.achievement,
                    "status": (
                        "On Track"
                        if conv.achievement >= 95
                        else "At Risk" if conv.achievement >= 80 else "Behind"
                    ),
                    "label": conv.conversion_type,
                }
            )

        return Response(results)


class FinancialTargetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Target.objects.filter(target_type="financial")
    serializer_class = TargetSerializer

    @action(detail=False, methods=["get"])
    def summary(self, request):
        data = []

        for t in self.get_queryset():
            data.append(
                {
                    "name": t.name,
                    "target": t.target_value,
                    "achieved": t.achieved_value,
                    "achievement": t.achievement_percent,
                    "variance": t.variance,
                    "status": t.status,
                }
            )

        return Response(data)


class CampaignROIViewSet(viewsets.ModelViewSet):
    queryset = CampaignROI.objects.all()
    serializer_class = CampaignROISerializer

    @action(detail=False, methods=["get"])
    def summary(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class TargetHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TargetHistory.objects.select_related("target")
    serializer_class = TargetHistorySerializer

    @action(detail=False, methods=["get"])
    def summary(self, request):
        data = []

        for h in self.get_queryset().order_by("-created_at"):
            data.append(
                {
                    "period": h.period_label,
                    "target": h.target_value,
                    "achieved": h.achieved_value,
                    "achievement": h.achievement,
                    "trend": (
                        "up"
                        if h.achievement >= 90
                        else "down" if h.achievement < 80 else "neutral"
                    ),
                }
            )

        return Response(data)
