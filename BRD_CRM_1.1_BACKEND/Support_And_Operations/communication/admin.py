from django.contrib import admin
from .models import Communication, CommunicationAttachment

class CommunicationAttachmentInline(admin.TabularInline):
    model = CommunicationAttachment
    extra = 0

@admin.register(Communication)
class CommunicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation_type', 'mode', 'lead_id', 'deal_id', 'status', 'direction', 'created_by', 'timestamp')
    inlines = [CommunicationAttachmentInline]

@admin.register(CommunicationAttachment)
class CommunicationAttachmentAdmin(admin.ModelAdmin):
    list_display = ('communication', 'file', 'uploaded_at')
