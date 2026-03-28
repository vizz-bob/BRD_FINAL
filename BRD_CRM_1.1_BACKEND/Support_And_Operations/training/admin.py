from django.contrib import admin
from .models import Training

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('training_id', 'training_title', 'training_format', 'completion_status', 'start_date', 'end_date')
    list_filter = ('training_format', 'completion_status', 'start_date', 'end_date')
    search_fields = ('training_title', 'trainer_name')
    filter_horizontal = ('assigned_to',)
