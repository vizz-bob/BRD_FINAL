from rest_framework.views import APIView
from rest_framework.response import Response


class LeadsStatusView(APIView):
    """
    Read-only status-wise leads from pipeline
    """
    def get(self, request):
        return Response({
            "New": PipelineLead.objects.filter(status='New').count(),
            "Attempted": PipelineLead.objects.filter(status='Attempted').count(),
            "Not Interested": PipelineLead.objects.filter(status='Not Interested').count(),
            "Qualified": PipelineLead.objects.filter(status='Qualified').count(),
        })
