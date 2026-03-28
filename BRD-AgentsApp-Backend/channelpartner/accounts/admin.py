from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User
from channelpartner.profiles.models import ProfileSettings, UserDocument

class ProfileSettingsInline(admin.StackedInline):
    model = ProfileSettings
    can_delete = False
    verbose_name_plural = 'Profile Settings'

class UserDocumentInline(admin.TabularInline):
    model = UserDocument
    extra = 0
    fields = ('doc_type', 'file', 'verified', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin with profile integration
    """
    list_display = ['username_contact', 'partner_id', 'role', 'kyc_verified', 'is_active', 'date_joined']
    list_filter = ['role', 'kyc_verified', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'partner_id', 'email', 'phone']
    ordering = ['-date_joined']
    
    inlines = [ProfileSettingsInline, UserDocumentInline]
    
    fieldsets = (
        ('Authentication', {
            'fields': ('username', 'email', 'phone', 'password')
        }),
        ('Partner Details', {
            'fields': ('partner_id', 'role', 'kyc_verified')
        }),
        ('Personal Info', {
            'fields': ('profile_image',)
        }),
        ('Banking Details', {
            'fields': ('bank_account', 'ifsc_code'),
            'classes': ('collapse',)
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['partner_id', 'date_joined', 'last_login']
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone', 'password1', 'password2'),
        }),
    )
    
    actions = ['verify_kyc', 'unverify_kyc', 'activate_users', 'deactivate_users']

    def username_contact(self, obj):
        contact = obj.email or '-'
        if obj.phone:
            contact = f"{contact} • {obj.phone}"
        return format_html(
            '{}<br/><span style="font-size:90%; color:#666">{}</span>',
            obj.username,
            contact
        )
    username_contact.short_description = 'User'
    username_contact.admin_order_field = 'username'
    
    def verify_kyc(self, request, queryset):
        updated = queryset.update(kyc_verified=True)
        self.message_user(request, f'{updated} user(s) marked as KYC verified.')
    verify_kyc.short_description = "Mark as KYC Verified"
    
    def unverify_kyc(self, request, queryset):
        updated = queryset.update(kyc_verified=False)
        self.message_user(request, f'{updated} user(s) marked as KYC not verified.')
    unverify_kyc.short_description = "Mark as KYC Not Verified"
    
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} user(s) activated.')
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} user(s) deactivated.')
    deactivate_users.short_description = "Deactivate selected users"
