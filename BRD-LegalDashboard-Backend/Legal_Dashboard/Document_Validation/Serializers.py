from rest_framework import serializers
from .models import Document
from .models import Document, UploadDocuments


class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        fields = '__all__'
class UploadDocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadDocuments
        fields = '__all__'        