from django.contrib import admin
from django.core.exceptions import ValidationError

# Import all your models from adminpanel.models
from .models import (
    ChargeMaster,
    DocumentType,
    LoanProduct,
    NotificationTemplate,
    RoleMaster,
    Subscription,
    Coupon,
    Dashboard,
)


# ==============================
# Admin Registrations
# ==============================

@admin.register(ChargeMaster)
class ChargeMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'charge_type', 'is_percentage', 'value', 'created_at')
    search_fields = ('name', 'charge_type')


@admin.register(DocumentType)
class DocumentTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'is_required', 'created_at')
    search_fields = ('name', 'code')


@admin.register(LoanProduct)
class LoanProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'loan_type', 'min_amount', 'max_amount', 'interest_rate', 'created_at')
    search_fields = ('name', 'loan_type')
    filter_horizontal = ('charges', 'required_documents')  # For ManyToMany fields


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'template_type', 'is_active', 'created_at')
    search_fields = ('name', 'template_type')


@admin.register(RoleMaster)
class RoleMasterAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_role', 'created_at')
    search_fields = ('name',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('subscription_name', 'subscription_amount', 'type_of', 'status', 'created_at')
    search_fields = ('subscription_name', 'type_of', 'status')


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('coupon_code', 'coupon_value', 'date_from', 'date_to', 'created_at')
    search_fields = ('coupon_code',)
    filter_horizontal = ('subscriptions',)  # Use actual ManyToMany field name


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ('total_tenants', 'active_users', 'total_loans', 'created_at', 'updated_at')
