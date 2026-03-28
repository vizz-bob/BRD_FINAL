from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Lead,CRMTool
from .serializers import LeadSerializer,CRMToolSerializer

class LeadViewSet(viewsets.ModelViewSet):

    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'loan_type', 'stage']

    def get_queryset(self):
        queryset = super().get_queryset()

        stage = self.request.query_params.get('stage')
        if stage:
            queryset = queryset.filter(stage=stage)

        assigned = self.request.query_params.get('assigned_to')
        if assigned:
            queryset = queryset.filter(assigned_to=assigned)

        return queryset

    @action(detail=False, methods=['get'])
    def stage_counts(self, request):
        data = (
            Lead.objects
            .values('stage')
            .annotate(count=Count('id'))
        )
        return Response(data)

    @action(detail=True, methods=['post'])
    def move_stage(self, request, pk=None):
        lead = self.get_object()
        new_stage = request.data.get("stage")
        lead.stage = new_stage
        lead.save()
        return Response({"status": "stage updated"})
class CRMToolViewSet(viewsets.ModelViewSet):

    queryset = CRMTool.objects.all()
    serializer_class = CRMToolSerializer

    @action(detail=True, methods=['post'])
    def sync_now(self, request, pk=None):
        tool = self.get_object()
        sync_crm_tool(tool)
        return Response({"status": "Sync triggered"})