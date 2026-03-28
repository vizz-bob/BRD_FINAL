# checked_lead/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import CheckedLead
from .serializers import CheckedLeadSerializer, CheckedLeadKanbanSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# List & Edit Leads
class CheckedLeadListView(generics.ListAPIView):
    queryset = CheckedLead.objects.all()
    serializer_class = CheckedLeadSerializer

class CheckedLeadUpdateView(generics.UpdateAPIView):
    queryset = CheckedLead.objects.all()
    serializer_class = CheckedLeadSerializer

# Move to Qualified
@api_view(['POST'])
def move_to_qualified(request, pk):
    try:
        lead = CheckedLead.objects.get(pk=pk)
        lead.status = 'qualified'
        lead.save()
        return Response({"message": "Lead moved to qualified"}, status=status.HTTP_200_OK)
    except CheckedLead.DoesNotExist:
        return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)

# Mark lead dead
@api_view(['POST'])
def mark_lead_dead(request, pk):
    try:
        lead = CheckedLead.objects.get(pk=pk)
        lead.delete()
        return Response({"message": "Lead marked as dead and deleted"}, status=status.HTTP_200_OK)
    except CheckedLead.DoesNotExist:
        return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)

# Kanban board view
class CheckedLeadKanbanView(generics.ListAPIView):
    serializer_class = CheckedLeadKanbanSerializer

    def get_queryset(self):
        return CheckedLead.objects.all().order_by('status', '-updated_at')
class CheckedLeadKanbanView(APIView):
    def get(self, request):
        data = {}
        statuses = ['new', 'attempted', 'not_interested']  # these are only in Lead
        for status in statuses:
            leads = CheckedLead.objects.filter(lead__status=status).order_by('-updated_at')
            serializer = CheckedLeadKanbanSerializer(leads, many=True)
            data[status] = serializer.data
        return Response(data)