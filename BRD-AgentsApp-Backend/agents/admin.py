from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Agent, AgentProfile, AgentEarnings, AgentAttendance, Case, FieldVerification,  PrivacyPolicy,PrivacyPolicySection,PrivacyQuickSummary,SupportTicket,FieldVerificationPhoto

admin.site.register(FieldVerificationPhoto)


@admin.register(Agent)
class AgentAdmin(UserAdmin):

    model = Agent

    list_display = (
        'email',
        'mobile',
        'role',
        'is_active',
        'is_staff',
    )

    list_filter = (
        'role',
        'is_active',
        'is_staff',
    )

    search_fields = (
        'email',
        'mobile',
    )

    ordering = ('email',)

    # IMPORTANT: remove username completely
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('mobile', 'role')}),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),
        ('Important Dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'mobile',
                'role',
                'password1',
                'password2',
                'is_active',
                'is_staff',
            ),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions')

    def get_queryset(self, request):
        return super().get_queryset(request)

@admin.register(AgentProfile)
class AgentProfileAdmin(admin.ModelAdmin):
    list_display = (
        'agent',
        'agent_code',
        'name',
        'branch',
        'sync_status',
        'pending_items',
        'created_at',
    )

    search_fields = (
        'agent_code',
        'name',
        'agent__email',
        'agent__mobile',
    )

    list_filter = (
        'branch',
        'sync_status',
    )

    readonly_fields = ('created_at',)


@admin.register(AgentEarnings)
class AgentEarningsAdmin(admin.ModelAdmin):
    list_display = ('agent', 'this_month', 'last_month', 'total', 'updated_at')
    search_fields = ('agent__email', 'agent__mobile')


@admin.register(AgentAttendance)
class AgentAttendanceAdmin(admin.ModelAdmin):
    list_display = ('agent', 'date', 'punch_in', 'punch_out', 'status')
    search_fields = ('agent__email', 'agent__mobile')
    list_filter = ('status', 'date')


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'agent',
        'customer_name',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'created_at',
    )

    search_fields = (
        'customer_name',
        'agent__email',
        'agent__mobile',
    )

    readonly_fields = ('created_at',)

    autocomplete_fields = ('agent',)
class PrivacyPolicySectionInline(admin.TabularInline):
    model = PrivacyPolicySection
    extra = 1
class PrivacyQuickSummaryInline(admin.TabularInline):
    model = PrivacyQuickSummary
    extra = 1

@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display = ('title', 'last_updated')
    inlines = [PrivacyPolicySectionInline, PrivacyQuickSummaryInline]
@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = (
        'agent',
        'issue_category',
        'status',
        'created_at',
    )

    list_filter = (
        'issue_category',
        'status',
        'created_at',
    )

    search_fields = (
        'agent__email',
        'issue_description',
    )

    readonly_fields = ('created_at',)

@admin.register(FieldVerification)
class FieldVerificationAdmin(admin.ModelAdmin):

    list_display = (
        'case',
        'agent',
        'applicant_met',
        'address_confirmed',
        'negative_profile',
    )

    list_filter = (
        'applicant_met',
        'address_confirmed',
        'negative_profile',
    )

    search_fields = (
        'case__id',
        'agent__email',
        'agent__mobile',
        'neighbor_name',
    )



    autocomplete_fields = (
        'agent',
        'case',
    )
