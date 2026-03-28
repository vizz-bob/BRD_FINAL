from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import QualifiedLead, ContactLead, DocumentCollection
from .serializers import QualifiedLeadSerializer, DocumentCollectionSerializer
from django.shortcuts import render, redirect, get_object_or_404
from .forms import ContactLeadForm, DocumentUploadForm
import csv
from django.http import HttpResponse
from rest_framework.views import APIView

class QualifiedLeadViewSet(viewsets.ModelViewSet):
    queryset = QualifiedLead.objects.all()
    serializer_class = QualifiedLeadSerializer
    permission_classes = [AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "phone_number", "lead_id"]
    ordering_fields = ["updated_at", "status"]
    ordering = ["-updated_at"]


    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get('status')
        if status and status != "ALL":
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=True, methods=['post'], url_path='move-to-hot')
    def move_to_hot(self, request, pk=None):
        lead = self.get_object()
        
        # 1. Update status in Pipeline
        if lead.pipeline_lead:
            lead.pipeline_lead.status = "HOT_LEAD"
            lead.pipeline_lead.save()
        
        # 2. Update status in QualifiedLead
        lead.status = "ELIGIBLE"
        lead.save()

        # 3. Create HotLead entry in hot_lead app
        try:
            from hot_lead.models import Lead as HotLeadStageLead, HotLead as HotLeadRecord, Stage
            stage, _ = Stage.objects.get_or_create(name="Hot stage")
            
            # Check for document completion
            docs = lead.documents.first()
            docs_completed = False
            if docs:
                docs_completed = docs.required_completed_count() >= 4
            
            # Check if already exists by phone or name
            hot_lead_stage_lead = HotLeadStageLead.objects.filter(phone=lead.phone_number).first()
            if not hot_lead_stage_lead:
                hot_lead_stage_lead = HotLeadStageLead.objects.create(
                    name=lead.name,
                    phone=lead.phone_number,
                    lead_source="Qualified Lead",
                    status="NEW",
                    stage=stage,
                    score=lead.score,
                    intent_percentage=lead.score,
                    docs_completed=docs_completed,
                    priority=lead.priority.upper() if lead.priority else "MEDIUM"
                )
            else:
                # Update existing record
                hot_lead_stage_lead.docs_completed = docs_completed
                hot_lead_stage_lead.intent_percentage = lead.score
                if lead.priority:
                    hot_lead_stage_lead.priority = lead.priority.upper()
                hot_lead_stage_lead.save()
            
            HotLeadRecord.objects.get_or_create(lead=hot_lead_stage_lead, defaults={"tag_status": "HOT"})

            # 4. Create/Update record in conversion_board
            from conversion_board.models import Lead as ConversionLead, LeadStatus
            ConversionLead.objects.update_or_create(
                pipeline_lead=lead.pipeline_lead,
                defaults={
                    "status": LeadStatus.DOC_VERIFICATION,
                    "score": lead.score
                }
            )

        except Exception as e:
            # Log error but return success since primary transition happened
            print(f"Error syncing to hot_lead/conversion_board: {e}")

        return Response(QualifiedLeadSerializer(lead).data)

    @action(detail=True, methods=['post'], url_path='mark-ineligible')
    def mark_ineligible(self, request, pk=None):
        lead = self.get_object()
        lead.status = "INELIGIBLE"
        lead.save()
        
        # Optional: update pipeline lead status too
        if lead.pipeline_lead:
            lead.pipeline_lead.status = "SUPPRESSED"
            lead.pipeline_lead.save()
            
        return Response(QualifiedLeadSerializer(lead).data)

    @action(detail=True, methods=['post'], url_path='upload-document')
    def upload_document(self, request, pk=None):
        lead = self.get_object()
        document, created = DocumentCollection.objects.get_or_create(lead=lead)
        serializer = DocumentCollectionSerializer(document, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['post'], url_path='schedule-follow-up')
    def schedule_follow_up(self, request, pk=None):
        lead = self.get_object()
        follow_up_date = request.data.get('next_follow_up')
        next_action = request.data.get('next_action', 'follow_up')
        
        if follow_up_date:
            lead.next_follow_up = follow_up_date
            lead.next_action = next_action
            lead.save()
            return Response(QualifiedLeadSerializer(lead).data)
        return Response({"error": "No follow-up date provided"}, status=400)

# Legacy/Template Views (Internal Admin)
def contact_lead_create(request):
    if request.method == "POST":
        form = ContactLeadForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("contact_add")
    else:
        form = ContactLeadForm()
    return render(request, "contact_form.html", {"form": form})

def move_to_hot(request, pk):
    lead = get_object_or_404(ContactLead, pk=pk)
    lead.status = "hot"
    lead.save()
    return redirect("contact_list")

def mark_ineligible(request, pk):
    lead = get_object_or_404(ContactLead, pk=pk)
    lead.status = "ineligible"
    lead.save()
    return redirect("contact_list")

def document_upload(request, lead_id):
    lead = get_object_or_404(QualifiedLead, id=lead_id)
    document, created = DocumentCollection.objects.get_or_create(lead=lead)
    if request.method == "POST":
        form = DocumentUploadForm(request.POST, request.FILES, instance=document)
        if form.is_valid():
            form.save()
            return redirect("document_upload", lead_id=lead.id)
    else:
        form = DocumentUploadForm(instance=document)
    return render(request, "document_upload.html", {
        "form": form,
        "lead": lead,
        "document": document
    })

# ==========================================
# 🔹 Export Qualified Leads to CSV
# ==========================================
class ExportQualifiedLeadsCSV(APIView):
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="qualified_leads.csv"'

        writer = csv.writer(response)
        writer.writerow(['Lead ID', 'Name', 'Phone', 'Interest', 'Status', 'Score', 'Priority', 'Next Follow Up'])

        leads = QualifiedLead.objects.all()
        for lead in leads:
            writer.writerow([
                lead.lead_id,
                lead.name,
                lead.phone_number,
                lead.interest.replace('_', ' ').title(),
                lead.status.replace('_', ' ').title(),
                f"{lead.score}%",
                lead.priority.title(),
                lead.next_follow_up
            ])

        return response
