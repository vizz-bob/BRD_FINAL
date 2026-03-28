
from django.contrib import admin
from .models import AgentProfile, Performance, Collection, AppSettings
from collectionagent.user_profile.models import (
    PrivacyPolicy,
    PrivacyPolicySection,
    PrivacyQuickSummary,
    FAQ,
    SupportContact,
    SupportTicket
)

# ---------------- NORMAL REGISTRATIONS ----------------

admin.site.register(AgentProfile)
admin.site.register(Performance)
admin.site.register(Collection)
admin.site.register(AppSettings)

# ---------------- INLINES (DEFINE FIRST) ----------------

class PrivacyPolicySectionInline(admin.StackedInline):
    model = PrivacyPolicySection
    extra = 1


class PrivacyQuickSummaryInline(admin.StackedInline):
    model = PrivacyQuickSummary
    extra = 1


class FAQInline(admin.StackedInline):
    model = FAQ
    extra = 1


class SupportContactInline(admin.StackedInline):
    model = SupportContact
    extra = 1


class SupportTicketInline(admin.StackedInline):
    model = SupportTicket
    extra = 1


# ---------------- MAIN ADMIN ----------------

@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    inlines = [
        PrivacyQuickSummaryInline,
        PrivacyPolicySectionInline,
        FAQInline,
        SupportContactInline,
        SupportTicketInline,
    ]
