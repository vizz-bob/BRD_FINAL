from django.contrib import admin
from .models import Document, Review, Report


# ========================
# Document Admin
# ========================
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'uploaded_at')
    search_fields = ('title', 'document_type')


# ========================
# Review Admin
# ========================
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('review_title', 'assigned_to', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('review_title',)


# ========================
# Report Admin
# ========================
@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('report_type', 'date_from', 'date_to', 'generated_at')

from .models import DocumentDetail

@admin.register(DocumentDetail)
class DocumentDetailAdmin(admin.ModelAdmin):
    list_display = ('document_id', 'status', 'priority', 'submitted_by', 'created_at')    