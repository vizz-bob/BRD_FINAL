#-------------------------
# Dashboard
#-------------------------
from django.contrib import admin
from .models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):

    list_display = (
        'total_templates',
        'active',
        'draft',
        'agents_covered',
        'created_at',
    )

    list_filter = ('created_at',)
    ordering = ('-created_at',)
#---------------------
# New Template
#----------------------
from django.contrib import admin
from .models import NewTemplate, PerformanceMetric


class PerformanceMetricInline(admin.TabularInline):
    model = PerformanceMetric
    extra = 1


@admin.register(NewTemplate)
class NewTemplateAdmin(admin.ModelAdmin):
    list_display = ('template_name', 'agent_type', 'review_cycle', 'status', 'create_template', 'cancel')
    list_filter = ('agent_type', 'review_cycle', 'status')
    inlines = [PerformanceMetricInline]