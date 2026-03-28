from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from .models import PropertyInformation,ValuationAssessment
from .models import ClientInformation,Documents,Details,RecentValuation
from .serializers import PropertyInformationSerializer,ValuationAssessmentSerializer
from .serializers import ClientInformationSerializer,DetailsSerializer,DocumentsSerializer
from .serializers import RecentValuationSerializer
#-----------------------
# Property Information
#------------------------
class PropertyInformationListCreateView(APIView):
    def get(self, request):
        properties = PropertyInformation.objects.all()
        serializer = PropertyInformationSerializer(properties, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = PropertyInformationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PropertyInformationDetailView(APIView):
    def get_object(self, pk):
        try:
            return PropertyInformation.objects.get(pk=pk)
        except PropertyInformation.DoesNotExist:
            return None
    def get(self, request, pk):
        property_obj = self.get_object(pk)
        if not property_obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PropertyInformationSerializer(property_obj)
        return Response(serializer.data)
    def put(self, request, pk):
        property_obj = self.get_object(pk)
        if not property_obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PropertyInformationSerializer(property_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        property_obj = self.get_object(pk)
        if not property_obj:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        property_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
#-----------------------------
# Valuation Assessment
#-----------------------------
class ValuationAssessmentViewSet(viewsets.ModelViewSet):
    queryset = ValuationAssessment.objects.all()
    serializer_class = ValuationAssessmentSerializer
#--------------------------
#Client Information
#--------------------------
class ClientInformationViewSet(viewsets.ModelViewSet):
    queryset = ClientInformation.objects.all()
    serializer_class = ClientInformationSerializer
#----------------------------
# Details
#------------------------------
class DetailsViewSet(viewsets.ModelViewSet):
    queryset = Details.objects.all()
    serializer_class = DetailsSerializer
#----------------------------
# Documents
#--------------------------
class DocumentsViewSet(viewsets.ModelViewSet):
    queryset = Documents.objects.all()
    serializer_class = DocumentsSerializer
#----------------------------
# Recent valuation
#----------------------------
class RecentValuationViewSet(viewsets.ModelViewSet):
    queryset = RecentValuation.objects.all().order_by("-created_at")
    serializer_class = RecentValuationSerializer