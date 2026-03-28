
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Vehicle, Payment, RecoveryFollowUp, RecoveryActivity, YardEntry, YardPhoto,
    RecoveryRepossessionHistory, VehicleScan
)

# =========================
# Vehicle Admin
# =========================
@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'model_name', 'color', 'status', 'priority', 'dpd', 'overdue_amount')
    search_fields = ('vehicle_number', 'model_name', 'color')
    list_filter = ('status', 'priority')
    ordering = ('-dpd',)

# =========================
# Payment Admin
# =========================
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('account', 'amount', 'payment_mode', 'collection_date', 'created_at')
    search_fields = ('account__id', 'account__user__username')
    list_filter = ('payment_mode', 'collection_date')
    ordering = ('-collection_date',)

# =========================
# FollowUp Admin
# =========================
@admin.register(RecoveryFollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ('account', 'followup_type', 'disposition', 'contact_person', 'ptp_date', 'ptp_amount', 'created_at')
    search_fields = ('account__id', 'account__user__username')
    list_filter = ('followup_type', 'disposition', 'contact_person')
    ordering = ('-created_at',)

# =========================
# Activity Admin
# =========================
@admin.register(RecoveryActivity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'action', 'note', 'created_by', 'timestamp')
    search_fields = ('vehicle__vehicle_number', 'created_by__username', 'note')
    list_filter = ('action', 'created_by', 'timestamp')
    ordering = ('-timestamp',)

# =========================
# YardEntry Admin
# =========================
@admin.register(YardEntry)
class YardEntryAdmin(admin.ModelAdmin):
    list_display = ('vehicle', 'odometer_reading', 'fuel_level', 'vehicle_condition', 'tyres_condition', 'created_by', 'created_at')
    search_fields = ('vehicle__vehicle_number', 'created_by__username')
    list_filter = ('fuel_level', 'vehicle_condition', 'tyres_condition', 'created_by', 'created_at')
    ordering = ('-created_at',)

# =========================
# YardPhoto Admin
# =========================
@admin.register(YardPhoto)
class YardPhotoAdmin(admin.ModelAdmin):
    list_display = ('yard_entry', 'image_tag', 'uploaded_at')
    search_fields = ('yard_entry__vehicle__vehicle_number',)

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" />', obj.image.url)
        return "-"
    image_tag.short_description = 'Photo'

# =========================
# RepossessionHistory Admin
# =========================
@admin.register(RecoveryRepossessionHistory)
class RepossessionHistoryAdmin(admin.ModelAdmin):
    list_display = ('account', 'vehicle_number', 'status', 'amount', 'created_at')
    list_filter = ('status',)
    search_fields = ('account__name', 'vehicle_number')
    ordering = ('-created_at',)

# =========================
# VehicleScan Admin
# =========================
@admin.register(VehicleScan)
class VehicleScanAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'get_result', 'file', 'scanned_at')
    search_fields = ('vehicle_number',)
    list_filter = ('scanned_at',)
    ordering = ('-scanned_at',)

    def get_result(self, obj):
        # Placeholder: return OCR result if available, otherwise vehicle_number
        return getattr(obj, 'result', obj.vehicle_number)
    get_result.short_description = 'Result'
