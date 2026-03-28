from rest_framework import generics
from rest_framework.viewsets import ModelViewSet
from .models import RawLeadPool as RawLead, ValidationEngineConfiguration, SuppressionList
from .serializers import RawLeadPool,RawLeadSerializer, ValidationEngineConfigurationSerializer, SuppressionListSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count
# -------- RawLead Views --------
class RawLeadListCreateAPIView(generics.ListCreateAPIView):
    queryset = RawLead.objects.all().order_by('-ingested_at')
    serializer_class = RawLeadSerializer

class SuppressionListViewSet(ModelViewSet):
    queryset = SuppressionList.objects.all().order_by('-blocked_date')
    serializer_class = SuppressionListSerializer

class RawLeadRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RawLead.objects.all()
    serializer_class = RawLeadSerializer

# -------- ValidationEngineConfiguration View --------
class ValidationEngineConfigurationAPIView(generics.RetrieveUpdateAPIView):
    queryset = ValidationEngineConfiguration.objects.all()
    serializer_class = ValidationEngineConfigurationSerializer

    def get_object(self):
        # Hamesha first configuration return kare
        obj, created = ValidationEngineConfiguration.objects.get_or_create(id=1)
        return obj
    
class SuppressionListViewSet(ModelViewSet):
    queryset = SuppressionList.objects.all().order_by('-blocked_date')
    serializer_class = SuppressionListSerializer


@api_view(["GET"])
def ingestion_stats(request):

    total_raw_pool = RawLeadPool.objects.count()

    verified = RawLeadPool.objects.filter(validation_status="verified").count()

    validation_pass = 0
    if total_raw_pool > 0:
        validation_pass = round((verified / total_raw_pool) * 100, 2)

    pending_assignment = RawLeadPool.objects.filter(
        assigned_to__isnull=True
    ).count()

    suppressed_leads = SuppressionList.objects.count()

    data = [
        {
            "label": "Total Raw Pool",
            "value": total_raw_pool,
            "change": "Stage 1 Entry",
        },
        {
            "label": "Validation Pass",
            "value": f"{validation_pass}%",
            "change": "Data hygiene",
        },
        {
            "label": "Pending Assignment",
            "value": pending_assignment,
            "change": "Ready for Stage 2",
        },
        {
            "label": "Suppressed Leads",
            "value": suppressed_leads,
            "change": "No Consent",
        },
    ]

    return Response(data)