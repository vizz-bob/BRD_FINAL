from django.contrib import admin
from .models import Report, Analytics


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'report_type', 'generated_at')
    list_filter = ('report_type', 'tenant', 'generated_at')
    search_fields = ('name',)
    readonly_fields = ('generated_at',)


@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('metric', 'tenant', 'value', 'as_of_date')
    list_filter = ('tenant', 'as_of_date')
    search_fields = ('metric',)
