#---------------------------
# New Offer Details
#---------------------------
from django.contrib import admin
from .models import New_Offer_Details


@admin.register(New_Offer_Details)
class NewOfferAdmin(admin.ModelAdmin):
    list_display = (
        'offer_title',
        'offer_type',
        'status',
        'start_date',
        'end_date',
        'max_usage_limit',
    )

    list_filter = ('status', 'offer_type')
    search_fields = ('offer_title', 'offer_tag')
#-----------------------
# New Target
#------------------------
from django.contrib import admin
from .models import New_Targetting


@admin.register(New_Targetting)
class NewTargettingAdmin(admin.ModelAdmin):

    list_display = (
        'target_agent_type',
        'target_tenants',
        'accent_color',
        'cancel',
        'next_step',
        'created_at',
    )

    list_filter = (
        'target_agent_type',
        'target_tenants',
        'accent_color',
        'cancel',
        'next_step',
    )

    search_fields = (
        'target_agent_type',
        'target_tenants',
    )

    ordering = ('-created_at',)

    list_per_page = 20
#-----------------------
# dashboard
#-----------------------
from django.contrib import admin
from .models import Dashboard


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):

    list_display = (
        'total_offers',
        'scheduled',
        'active_now',
        'total_redemptions',
        'created_at',
    )

    list_filter = ('created_at',)

    ordering = ('-created_at',)

    list_per_page = 20