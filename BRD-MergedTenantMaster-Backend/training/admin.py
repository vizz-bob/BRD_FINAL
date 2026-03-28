from django.contrib import admin
from .models import TrainingModule

@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'type', 'duration', 'completed', 'tenant')
    list_filter = ('category', 'type', 'completed', 'tenant')
    search_fields = ('title', 'category')
