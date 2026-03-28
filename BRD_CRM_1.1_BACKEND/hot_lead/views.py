from django.db import models
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import HotLead
from .serializers import HotLeadSerializer


# ==========================================
# 1️⃣ List All Hot Leads (Queue)
# ==========================================
class HotLeadListView(generics.ListAPIView):
    queryset = HotLead.objects.all()
    serializer_class = HotLeadSerializer


# ==========================================
# 2️⃣ Update Hot Lead (General Update)
# ==========================================
class HotLeadUpdateView(generics.UpdateAPIView):
    queryset = HotLead.objects.all()
    serializer_class = HotLeadSerializer
    lookup_field = 'pk'


# ==========================================
# 3️⃣ Move Lead to QUALIFIED
# ==========================================
class MoveToQualifiedView(APIView):
    def post(self, request, pk):
        try:
            hot_lead = HotLead.objects.get(pk=pk)
            hot_lead.lead.status = "DEAL"
            hot_lead.lead.save()

            # Sync to QualifiedLeads
            try:
                from qualified_leads.models import QualifiedLead
                ql = QualifiedLead.objects.filter(phone_number=hot_lead.lead.phone).first()
                if ql:
                    ql.status = "ELIGIBLE"
                    ql.qualification_notes = f"Converted to Deal via Priority List on {hot_lead.updated_at}"
                    ql.save()
            except Exception as e:
                print(f"HotLead Sync Error: {e}")

            return Response({"message": "Lead converted to DEAL"})
        except HotLead.DoesNotExist:
            return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)


# ==========================================
# 4️⃣ Mark Lead as DEAD/DORMANT
# ==========================================
class MarkLeadDeadView(APIView):
    def post(self, request, pk):
        try:
            hot_lead = HotLead.objects.get(pk=pk)
            hot_lead.lead.status = "DORMANT" 
            hot_lead.lead.save()

            # Sync to QualifiedLeads
            try:
                from qualified_leads.models import QualifiedLead
                ql = QualifiedLead.objects.filter(phone_number=hot_lead.lead.phone).first()
                if ql:
                    ql.status = "INELIGIBLE"
                    ql.qualification_notes = "Marked as Dormant/Dead via Priority List"
                    ql.save()
            except Exception as e:
                print(f"HotLead Sync Error: {e}")

            return Response({"message": "Lead marked as DORMANT"})
        except HotLead.DoesNotExist:
            return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)


# ==========================================
# 5️⃣ Drag & Drop Update Status (Conversion Board API)
# ==========================================
class UpdateLeadStatusView(APIView):
    def patch(self, request, pk):
        try:
            hot_lead = HotLead.objects.get(pk=pk)
            new_status = request.data.get("status")

            # Map frontend titles to backend statuses
            status_map = {
                "Doc Verification": "NEW",
                "Ready for Consult": "FOLLOW_UP",
                "Meeting Scheduled": "MEETING",
                "Follow Up": "FOLLOW_UP"
            }
            backend_status = status_map.get(new_status, new_status)
            
            hot_lead.lead.status = backend_status
            hot_lead.lead.save()

            # Sync to QualifiedLeads
            try:
                from qualified_leads.models import QualifiedLead
                ql = QualifiedLead.objects.filter(phone_number=hot_lead.lead.phone).first()
                if ql:
                    ql.status = "UNDER_REVIEW"
                    ql.next_action = "follow_up" if backend_status == "FOLLOW_UP" else "schedule_meeting"
                    ql.qualification_notes = f"Priority List Status Change: {backend_status}"
                    ql.save()
            except Exception as e:
                print(f"HotLead Sync Error: {e}")

            return Response({"message": "Status updated successfully"})
        except HotLead.DoesNotExist:
            return Response({"error": "Lead not found"}, status=404)



# ==========================================
# 6️⃣ Kanban / Conversion Board (Grouped by Status)
# ==========================================
class HotLeadKanbanView(APIView):
    def get(self, request):
        # Frontend Columns mapping
        # Doc Verification -> NEW
        # Ready for Consult -> FOLLOW_UP
        # Meeting Scheduled -> MEETING
        
        columns = [
            {
                "title": "Doc Verification",
                "color": "bg-amber-400",
                "leads": HotLeadSerializer(HotLead.objects.filter(lead__status="NEW"), many=True).data
            },
            {
                "title": "Ready for Consult",
                "color": "bg-emerald-500",
                "leads": HotLeadSerializer(HotLead.objects.filter(lead__status="FOLLOW_UP"), many=True).data
            },
            {
                "title": "Meeting Scheduled",
                "color": "bg-indigo-500",
                "leads": HotLeadSerializer(HotLead.objects.filter(lead__status="MEETING"), many=True).data
            }
        ]
        return Response(columns)



# ==========================================
# 7️⃣ Priority List (High → Medium → Low)
# ==========================================
class PriorityListView(generics.ListAPIView):
    serializer_class = HotLeadSerializer

    def get_queryset(self):
        return HotLead.objects.all().order_by(
            models.Case(
                models.When(lead__priority="HIGH", then=0),
                models.When(lead__priority="MEDIUM", then=1),
                models.When(lead__priority="LOW", then=2),
                default=3
            )
        )
import csv
from django.http import HttpResponse

# ==========================================
# 8️⃣ Export Hot Leads to CSV
# ==========================================
class ExportHotLeadsCSV(APIView):
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="hot_leads.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Phone', 'Source', 'Priority', 'Status', 'Intent Score'])

        hot_leads = HotLead.objects.all()
        for hl in hot_leads:
            writer.writerow([
                f"HOT-{hl.lead.id}",
                hl.lead.name,
                hl.lead.phone,
                hl.lead.lead_source,
                hl.lead.priority,
                hl.lead.status,
                f"{hl.lead.intent_percentage}%"
            ])

        return response
