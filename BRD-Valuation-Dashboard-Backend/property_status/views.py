#--------------------------------
# Property status pending
#---------------------------------
from rest_framework import viewsets
from .models import PropertyPending
from .serializers import PropertyPendingSerializer
class PropertyPendingViewSet(viewsets.ModelViewSet):
    queryset = PropertyPending.objects.all().order_by("-created_at")
    serializer_class = PropertyPendingSerializer
#-------------------------
# In progress
#-------------------------
from rest_framework import viewsets
from .models import PropertyInProgress
from .serializers import PropertyInProgressSerializer
class PropertyInProgressViewSet(viewsets.ModelViewSet):
    queryset = PropertyInProgress.objects.all().order_by("-created_at")
    serializer_class = PropertyInProgressSerializer
#---------------------------------
# Property status Completed
#---------------------------------
from rest_framework import viewsets
from .models import PropertyCompleted
from .serializers import PropertyCompletedSerializer


class PropertyCompletedViewSet(viewsets.ModelViewSet):
    queryset = PropertyCompleted.objects.all().order_by("-created_at")
    serializer_class = PropertyCompletedSerializer
#-----------------------------
# status and search
#----------------------------
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q

from .models import PropertyPending, PropertyInProgress, PropertyCompleted


class StatusSearchView(APIView):

    def get(self, request):
        status = request.GET.get("status")
        search = request.GET.get("search")

        if status == "Pending":
            qs = PropertyPending.objects.all()
        elif status == "In Progress":
            qs = PropertyInProgress.objects.all()
        elif status == "Completed":
            qs = PropertyCompleted.objects.all()
        else:
            qs = list(PropertyPending.objects.all()) + \
                 list(PropertyInProgress.objects.all()) + \
                 list(PropertyCompleted.objects.all())

        if search:
            qs = [obj for obj in qs if search.lower() in obj.property_id.lower() 
                  or (obj.name and search.lower() in obj.name.lower())]

        data = [{"property_id": obj.property_id, "name": obj.name, "status": obj.status} for obj in qs]

        return Response(data)