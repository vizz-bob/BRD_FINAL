# from django.contrib import admin
# # from .models import ProfileSettings, UserDocument
# from .models import ProfileSettings, UserDocument, Lead


# @admin.register(ProfileSettings)
# class ProfileSettingsAdmin(admin.ModelAdmin):
#     list_display = ['user', 'push_notifications', 'email_alerts', 'dark_mode']
#     search_fields = ['user__username', 'user__email']

# @admin.register(UserDocument)
# class UserDocumentAdmin(admin.ModelAdmin):
#     list_display = ['user', 'doc_type', 'verified', 'uploaded_at']
#     list_filter = ['doc_type', 'verified']
#     search_fields = ['user__username']

# # ..................
# @admin.register(Lead)
# class LeadAdmin(admin.ModelAdmin):
#     list_display = ['full_name', 'mobile_number', 'email', 'pan_number', 'created_at']
#     search_fields = ['full_name', 'mobile_number']


# @admin.register(Lead)
# class LeadAdmin(admin.ModelAdmin):
#     list_display = [
#         'full_name',
#         'mobile_number',
#         'email',
#         'city',
#         'created_at'
#     ]


from django.contrib import admin
from django.urls import path, reverse
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.views.decorators.http import require_http_methods
from django.utils.html import format_html
from .models import ProfileSettings, UserDocument, Lead_Profile, PrivacyPolicy, SupportTicket, SupportContactInfo

@admin.register(ProfileSettings)
class ProfileSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'push_notifications', 'email_alerts', 'dark_mode']
    search_fields = ['user__username', 'user__email']

@admin.register(UserDocument)
class UserDocumentAdmin(admin.ModelAdmin):
    list_display = ['user', 'doc_type', 'verified', 'uploaded_at']
    list_filter = ['doc_type', 'verified']
    search_fields = ['user__username']

@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display = ['title', 'version', 'is_active', 'last_updated', 'view_privacy_with_support_link']
    list_filter = ['is_active', 'last_updated']
    search_fields = ['title', 'version']
    fieldsets = (
        ('Policy Information', {
            'fields': ('title', 'version', 'is_active', 'introduction', 'quick_summary')
        }),
        ('10 Privacy Sections', {
            'fields': (
                'information_we_collect',
                'how_we_use_information',
                'information_sharing',
                'data_security',
                'your_rights_and_choices',
                'data_retention',
                'cookies_and_tracking',
                'third_party_services',
                'childrens_privacy',
                'changes_to_policy',
            )
        }),
        ('Contact', {
            'fields': ('contact_us',)
        }),
        ('Timestamps', {
            'fields': ('last_updated', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'last_updated']
    
    def view_privacy_with_support_link(self, obj):
        """Add a link to view privacy policy with support"""
        if obj.is_active:
            url = reverse('admin:view_privacy_with_support')
            return format_html(
                '<a class="button" href="{}">👁️ View with Support</a>',
                url
            )
        return '-'
    view_privacy_with_support_link.short_description = 'View Policy'
    
    def get_urls(self):
        """Add custom URL for viewing privacy policy with support"""
        urls = super().get_urls()
        custom_urls = [
            path(
                'view-with-support/',
                self.admin_site.admin_view(self.privacy_policy_with_support_view),
                name='view_privacy_with_support'
            ),
        ]
        return custom_urls + urls
    
    def privacy_policy_with_support_view(self, request):
        """Display privacy policy with have questions section and support features"""
        privacy_policy = PrivacyPolicy.objects.filter(is_active=True).first()
        support_contact_info = SupportContactInfo.objects.first()
        
        if not privacy_policy:
            return TemplateResponse(
                request,
                'admin/error.html',
                {'error': 'No active privacy policy found. Please create one first.'}
            )
        
        context = {
            'privacy_policy': privacy_policy,
            'support_contact_info': support_contact_info,
            'title': 'Privacy Policy - Have Questions?',
            'site_header': self.admin_site.site_header,
            'site_title': self.admin_site.site_title,
            'has_view_permission': True,
        }
        
        return TemplateResponse(
            request,
            'admin/profiles/privacy_policy_with_support.html',
            context
        )

@admin.register(Lead_Profile)
class LeadAdmin(admin.ModelAdmin):
    list_display = [
        'full_name',
        'mobile_number',
        'email',
        'city',
        'created_at'
    ]


@admin.register(SupportContactInfo)
class SupportContactInfoAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'whatsapp_number', 'email', 'support_hours', 'is_active', 'updated_at']
    list_filter = ['is_active', 'updated_at']
    fieldsets = (
        ('Contact Information', {
            'fields': ('phone_number', 'whatsapp_number', 'email', 'support_hours')
        }),
        ('Status', {
            'fields': ('is_active', 'updated_at')
        }),
    )
    readonly_fields = ['updated_at']
    
    def has_add_permission(self, request):
        """Only allow one support contact info entry"""
        return not SupportContactInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of support contact info"""
        return False
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Add custom title to change view"""
        extra_context = extra_context or {}
        extra_context['title'] = '📞 Support Contact Information'
        return super().change_view(request, object_id, form_url, extra_context=extra_context)


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'user', 'category_display', 'status_badge', 'assigned_to', 'created_at', 'view_details']
    list_filter = ['status', 'category', 'created_at', 'assigned_to']
    search_fields = ['ticket_id', 'user__username', 'issue_description']
    readonly_fields = ['ticket_id', 'created_at', 'updated_at', 'resolved_at', 'user']
    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_id', 'user', 'category', 'status'),
            'classes': ('wide', 'extrapretty'),
        }),
        ('Issue Details', {
            'fields': ('issue_description',),
            'classes': ('wide', 'extrapretty'),
        }),
        ('Support Assignment', {
            'fields': ('assigned_to', 'response_notes'),
            'classes': ('wide', 'extrapretty'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    def category_display(self, obj):
        """Display category with colors"""
        categories = {
            'ACCOUNT': '👤',
            'LEAD': '📋',
            'TECHNICAL': '⚙️',
            'PAYMENT': '💳',
            'DOCUMENTATION': '📄',
            'OTHER': '❓'
        }
        icon = categories.get(obj.category, '❓')
        return f"{icon} {obj.get_category_display()}"
    category_display.short_description = 'Category'
    
    def status_badge(self, obj):
        """Display status as badge"""
        status_colors = {
            'OPEN': '#ff6b6b',
            'IN_PROGRESS': '#ffd93d',
            'RESOLVED': '#6bcf7f',
            'CLOSED': '#999999'
        }
        color = status_colors.get(obj.status, '#999')
        return f'<span style="background-color: {color}; color: white; padding: 5px 10px; border-radius: 3px;">{obj.get_status_display()}</span>'
    status_badge.short_description = 'Status'
    status_badge.allow_tags = True
    
    def view_details(self, obj):
        """Link to view ticket details"""
        from django.urls import reverse
        url = reverse('admin:profiles_supportticket_change', args=[obj.pk])
        return f'<a class="button" href="{url}">View</a>'
    view_details.short_description = 'Action'
    view_details.allow_tags = True
    
    def get_readonly_fields(self, request, obj=None):
        """Allow editing of certain fields only for admins"""
        readonly = list(self.readonly_fields)
        if obj:  # Editing existing ticket
            if not request.user.is_staff:
                readonly.extend(['category', 'issue_description'])
        return readonly
