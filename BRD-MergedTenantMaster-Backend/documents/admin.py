from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'tenant', 'customer', 'uploaded_by', 'created_at')
    search_fields = ('uploaded_by', 'customer__first_name', 'customer__phone')
    list_filter = ('tenant', 'document_type', 'created_at')
    readonly_fields = ('created_at',)
