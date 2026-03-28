from rest_framework import viewsets
from .models import Document, UploadDocuments
from .Serializers import DocumentSerializer, UploadDocumentsSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class UploadDocumentsViewSet(viewsets.ModelViewSet):
    queryset = UploadDocuments.objects.all()
    serializer_class = UploadDocumentsSerializer