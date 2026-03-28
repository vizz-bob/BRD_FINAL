from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models
from .models import Lead, LeadStatus
from .serializers import LeadSerializer

# List all leads
class LeadListView(generics.ListAPIView):
    queryset = Lead.objects.all().order_by("-updated_at")
    serializer_class = LeadSerializer

# Update lead status
class LeadUpdateView(generics.UpdateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    lookup_field = "id"

# Hot Leads stats for dashboard
class HotLeadsStatsView(APIView):
    def get(self, request):
        total_hot = Lead.objects.count()
        sla_breach_count = 0
        leads = Lead.objects.all()
        for lead in leads:
            if lead.status == LeadStatus.SLA_BREACH or lead.is_sla_breach():
                sla_breach_count += 1
                
        docs_pending = Lead.objects.filter(status=LeadStatus.DOC_VERIFICATION).count()
        avg_intent = Lead.objects.aggregate(avg_score=models.Avg('score'))['avg_score'] or 0
        
        # Round avg_intent to 1 decimal place
        avg_intent = round(float(avg_intent), 1)

        return Response({
            "hot_leads": total_hot,
            "sla_breaches": sla_breach_count,
            "docs_pending": docs_pending,
            "avg_intent": avg_intent
        })

# Kanban View for Conversion Board
class HotLeadKanbanView(APIView):
    def get(self, request):
        columns = [
            {
                "title": "Doc Verification",
                "color": "bg-amber-400",
                "leads": LeadSerializer(Lead.objects.filter(status=LeadStatus.DOC_VERIFICATION), many=True).data
            },
            {
                "title": "Ready for Consult",
                "color": "bg-emerald-500",
                "leads": LeadSerializer(Lead.objects.filter(status=LeadStatus.READY_FOR_CONSULT), many=True).data
            },
            {
                "title": "Meeting Scheduled",
                "color": "bg-indigo-500",
                "leads": LeadSerializer(Lead.objects.filter(status=LeadStatus.MEETING_SCHEDULED), many=True).data
            }
        ]
        return Response(columns)

# Drag & Drop Update Status
class UpdateLeadStatusView(APIView):
    def patch(self, request, id):
        try:
            lead = Lead.objects.get(id=id)
            new_status = request.data.get("status")

            # Map frontend titles to backend statuses
            status_map = {
                "Doc Verification": LeadStatus.DOC_VERIFICATION,
                "Ready for Consult": LeadStatus.READY_FOR_CONSULT,
                "Meeting Scheduled": LeadStatus.MEETING_SCHEDULED,
                "Follow Up": LeadStatus.FOLLOW_UP
            }
            backend_status = status_map.get(new_status, new_status)
            
            lead.status = backend_status
            lead.save()

            # Sync to QualifiedLeads
            if lead.pipeline_lead:
                try:
                    from qualified_leads.models import QualifiedLead
                    ql = QualifiedLead.objects.filter(pipeline_lead=lead.pipeline_lead).first()
                    if ql:
                        ql.status = "UNDER_REVIEW"
                        ql.next_action = "follow_up" if backend_status == LeadStatus.FOLLOW_UP else "meeting"
                        ql.qualification_notes = f"Board Status Change: {backend_status}"
                        ql.save()
                except Exception as e:
                    print(f"Sync error: {e}")

            return Response({"message": "Status updated successfully"})
        except Lead.DoesNotExist:
            return Response({"error": "Lead not found"}, status=404)

# Move to Deals Stage
class MoveToDealView(APIView):
    def post(self, request, id):
        try:
            lead = Lead.objects.get(id=id)
            if lead.pipeline_lead:
                # 1. Pipeline Sync
                lead.pipeline_lead.status = "CONVERTED"
                lead.pipeline_lead.save()
                
                # 2. Qualified Lead Sync
                try:
                    from qualified_leads.models import QualifiedLead
                    ql = QualifiedLead.objects.filter(pipeline_lead=lead.pipeline_lead).first()
                    if ql:
                        ql.status = "ELIGIBLE"
                        ql.qualification_notes = f"Converted to Deal via Conversion Board on {lead.updated_at}"
                        ql.save() # This triggers ContactLog creation
                except Exception as e:
                    print(f"Sync error: {e}")

            lead.status = LeadStatus.CONVERTED
            lead.save()
            return Response({"message": "Moved to Deals Stage"})
        except Lead.DoesNotExist:
            return Response({"error": "Lead not found"}, status=404)

# Mark as Dormant
class MarkAsDormantView(APIView):
    def post(self, request, id):
        try:
            lead = Lead.objects.get(id=id)
            if lead.pipeline_lead:
                # 1. Pipeline Sync
                lead.pipeline_lead.status = "SUPPRESSED"
                lead.pipeline_lead.save()

                # 2. Qualified Lead Sync
                try:
                    from qualified_leads.models import QualifiedLead
                    ql = QualifiedLead.objects.filter(pipeline_lead=lead.pipeline_lead).first()
                    if ql:
                        ql.status = "INELIGIBLE"
                        ql.qualification_notes = "Marked as Dormant/Dead via Conversion Board"
                        ql.save()
                except Exception as e:
                    print(f"Sync error: {e}")

            lead.status = LeadStatus.DORMANT
            lead.save()
            return Response({"message": "Marked as Dormant"})
        except Lead.DoesNotExist:
            return Response({"error": "Lead not found"}, status=404)

import csv
from django.http import HttpResponse

# Export Leads to CSV
class ExportLeadsCSV(APIView):
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="conversion_leads.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Phone', 'Status', 'Intent Score', 'LOS Stage', 'LOS Status'])

        leads = Lead.objects.all()
        for lead in leads:
            name = "N/A"
            phone = "N/A"
            if lead.pipeline_lead and hasattr(lead.pipeline_lead, 'lead') and lead.pipeline_lead.lead:
                name = lead.pipeline_lead.lead.name
                phone = lead.pipeline_lead.lead.phone

            writer.writerow([
                lead.id,
                name,
                phone,
                lead.status,
                lead.score,
                lead.los_stage,
                lead.los_status
            ])

        return response
