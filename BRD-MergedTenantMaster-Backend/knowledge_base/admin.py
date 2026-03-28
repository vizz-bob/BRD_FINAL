from django.contrib import admin
from .models import KnowledgeResource

@admin.register(KnowledgeResource)
class KnowledgeResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'type', 'tenant', 'created_at')
    list_filter = ('category', 'type', 'tenant')
    search_fields = ('title', 'category')
