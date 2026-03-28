from django.contrib import admin
from .models import Branch


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):

    list_display = (
        'branch_name',
        'business',
        'status',
        'is_verified',
        'created_at',
    )

    list_filter = (
        'status',
        'is_verified',
        'business',
    )

    search_fields = (
        'branch_name',
        'mobile_no',
        'email',
        'business__business_name',
    )

    readonly_fields = (
        'id',
        'created_at',
    )

    filter_horizontal = (
        'allowed_products',
    )

    fieldsets = (
        ('Branch Details', {
            'fields': (
                'branch_name',
                'business',
                'allowed_products',
                'gstin',
            )
        }),
        ('Contact Information', {
            'fields': (
                'contact_person',
                'mobile_no',
                'email',
                'address',
            )
        }),
        ('Status & Security', {
            'fields': (
                'branch_password',
                'status',
                'is_verified',
            )
        }),
        ('System Info', {
            'fields': (
                'id',
                'created_at',
            )
        }),
    )

    ordering = ('-created_at',)
