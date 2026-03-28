from django.contrib import admin
from .models import Document, UploadDocuments

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'document_type', 'client_name', 'status', 'upload_date')
    list_filter = ('status', 'document_type')
    search_fields = ('name', 'client_name', 'document_type')


@admin.register(UploadDocuments)
class UploadDocumentsAdmin(admin.ModelAdmin):
    list_display = ('id', 'document_type', 'client_name', 'uploaded_at')
    search_fields = ('client_name', 'document_type')