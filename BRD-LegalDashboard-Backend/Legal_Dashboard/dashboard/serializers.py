from rest_framework import serializers
from .models import Document, Review, Report, DocumentDetail


class DocumentSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'document_type', 'uploaded_file', 'uploaded_at', 'status', 'priority']
    
    def get_status(self, obj):
        """Get status from related DocumentDetail if it exists"""
        try:
            return obj.documentdetail.status
        except DocumentDetail.DoesNotExist:
            return 'Pending'
    
    def get_priority(self, obj):
        """Get priority from related DocumentDetail if it exists"""
        try:
            return obj.documentdetail.priority
        except DocumentDetail.DoesNotExist:
            return 'Medium'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'
class DocumentDetailSerializer(serializers.ModelSerializer):
    average_tat = serializers.SerializerMethodField()

    class Meta:
        model = DocumentDetail
        fields = '__all__'

    def get_average_tat(self, obj):
        return obj.average_tat()       