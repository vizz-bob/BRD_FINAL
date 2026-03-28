from django.contrib import admin
from .models import  TargetHistory,CampaignROI,LoanAccount,Repayment,CollectionBucket,PromiseToPay,InteractionLog,RecoveryCase,SettlementDocument, Forecast,Campaign,Lead,AgentTarget,Target


class PromiseToPayInline(admin.TabularInline):
    model = PromiseToPay
    extra = 0
class InteractionLogInline(admin.TabularInline):
    model = InteractionLog
    extra = 0
@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = (
        "loan",
        "emi_number",
        "due_date",
        "amount_due",
        "amount_paid",
        "status",
        "payment_mode",
        "created_at",
    )

    list_filter = ("status", "payment_mode")
    search_fields = ("loan__loan_number",)


    def has_add_permission(self, request, obj=None):
        return True

@admin.register(LoanAccount)
class LoanAccountAdmin(admin.ModelAdmin):
    list_display = (
        "borrower_name",
        "loan_number",
        "outstanding_balance",
        "emi_amount",
        "emi_count",
        "created_at",
    )

    search_fields = (
        "borrower_name",
        "loan_number",
    )

    readonly_fields = (
        
        "created_at",
    )

    inlines = [PromiseToPayInline,InteractionLogInline]

    def has_add_permission(self, request):
        return True
class PromiseToPayInline(admin.TabularInline):
    model = PromiseToPay
    extra = 0
    fields = (
        "commit_date",
        "commit_amount",
    )
    readonly_fields = (
        "created_by",
        "created_at",
    )
    can_delete = False

class InteractionLogInline(admin.TabularInline):
    model = InteractionLog
    extra = 0
    fields = (
        "channel",
        "outcome",
        "created_by",
        "created_at",
    )
    readonly_fields = (
        "created_by",
        "created_at",
    )
    can_delete = False

    def save_new(self, form, commit=True):
        obj = super().save_new(form, commit=False)
        obj.loan = obj.collection_bucket.loan
        if commit:
            obj.save()
        return obj

@admin.register(CollectionBucket)
class CollectionBucketAdmin(admin.ModelAdmin):

    inlines = [
        PromiseToPayInline,
        InteractionLogInline,
    ]

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        for instance in instances:

            # PromiseToPay auto fields
            if isinstance(instance, PromiseToPay):
                instance.loan = instance.collection_bucket.loan
                instance.created_by = request.user

            if isinstance(instance, InteractionLog):
                instance.loan = instance.collection_bucket.loan
                if not instance.created_by:
                    instance.created_by = request.user

            instance.save()

        formset.save_m2m()
class SettlementDocumentInline(admin.TabularInline):
    model = SettlementDocument
    extra = 0
    fields = ("file","uploaded_at")
    readonly_fields = ("uploaded_at",)

    can_delete = True

    def has_add_permission(self, request, obj=None):
        return True
@admin.register(RecoveryCase)
class RecoveryCaseAdmin(admin.ModelAdmin):
    list_display = (
        "loan",
        "stage",
        "assigned_agent",
        "follow_up_date",
        "amount_collected",
        "updated_at",
    )

    list_filter = (
        "stage",
        "assigned_agent",
    )

    search_fields = (
        "loan__loan_number",
        "loan__borrower_name",
    )

    readonly_fields = (
        "loan",
        "updated_at",
    )

    inlines = [
        SettlementDocumentInline,
    ]

    fieldsets = (
        ("Recovery Details", {
            "fields": (
                "loan",
                "stage",
                "assigned_agent",
            )
        }),
        ("Follow-up & Collection", {
            "fields": (
                "follow_up_date",
                "amount_collected",
            )
        }),
        ("Settlement Summary", {
            "fields": (
                "settlement_notes",
            )
        }),
        ("System Info", {
            "fields": (
                "updated_at",
            )
        }),
    )
class CampaignInline(admin.TabularInline):
    model = Campaign
    extra = 1
    show_change_link = True
class LeadInline(admin.TabularInline):
    model = Lead
    extra = 0
    readonly_fields = ("created_at",)
    show_change_link = True

@admin.register(Forecast)
class ForecastAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "forecast_type",
        "period",
        "start_date",
        "end_date",
        "target_revenue",
        "created_at",
    )

    list_filter = (
        "forecast_type",
        "period",
    )

    search_fields = (
        "name",
    )

    readonly_fields = ("created_at",)
    inlines = [
        CampaignInline,
        LeadInline,
    ]
    fieldsets = (
        ("Forecast Info", {
            "fields": (
                "name",
                "forecast_type",
                "period",
            )
        }),
        ("Duration", {
            "fields": (
                "start_date",
                "end_date",
            )
        }),
        ("Targets", {
            "fields": (
                "target_revenue",
            )
        }),
        ("System Info", {
            "fields": (
                "created_at",
            )
        }),
    )

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(AgentTarget)
class AgentTargetAdmin(admin.ModelAdmin):
    list_display = (
        "agent",
        "forecast",
        "target_value",
        "achieved_value",
        "achievement_percent",
        "status",
        "updated_at",
    )
    readonly_fields = (
        "achievement_percent",
        "variance",
        "expected_deals",
        "status",
        "updated_at",
    )

    list_filter = (
        "forecast",
        "agent",
    )

    search_fields = (
        "agent__username",
        "forecast__name",
    )

from .models import (
    Target,
    ActivityTarget,
    ConversionTarget,
    CampaignROI,
    TargetHistory
)
class ActivityTargetInline(admin.TabularInline):
    model = ActivityTarget
    extra = 0
    fields = (
        "activity_type",
        "target_count",
        "achieved_count",
        "progress",
    )
    readonly_fields = ("progress",)
class ConversionTargetInline(admin.TabularInline):
    model = ConversionTarget
    extra = 0
    fields = (
        "stage_from",
        "stage_to",
        "target_rate",
        "actual_rate",
        "achievement",
    )
    readonly_fields = ("achievement",)
class CampaignROIInline(admin.TabularInline):
    model = CampaignROI
    extra = 0
    fields = (
        "channel",
        "spend",
        "leads",
        "conversions",
        "revenue",
        "cpl",
        "conversion_rate",
        "roi",
        "status",
    )
    readonly_fields = (
        "cpl",
        "conversion_rate",
        "roi",
        "status",
    )
class TargetHistoryInline(admin.TabularInline):
    model = TargetHistory
    extra = 0
    fields = (
        "period_label",
        "target_value",
        "achieved_value",
        "achievement",
        "created_at",
        "trend",
    )
    readonly_fields = (
        "achievement",
        "created_at",
        "trend", 
    )
@admin.register(Target)
class TargetAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "target_type",
        "target_value",
        "achieved_value",
        "achievement_percent",
        "variance",
        "status",
        "period",
        "assign_to",
        "user",
    )

    list_filter = (
        "target_type",
        "period",
        "assign_to",
    )

    search_fields = (
        "name",
        "user__username",
    )

    readonly_fields = (
        "achievement_percent",
        "variance",
        "status",
        "created_at",
    )

    fieldsets = (
        ("Target Definition", {
            "fields": (
                "name",
                "target_type",
                "target_value",
                "period",
                "assign_to",
                "user",
                "start_date",
                "end_date",
            )
        }),
        ("Financial Performance", {
            "fields": (
                "achieved_value",
                "achievement_percent",
                "variance",
                "status",
            )
        }),
        ("System", {
            "fields": ("created_at",)
        }),
    )

    inlines = [
        ActivityTargetInline,
        ConversionTargetInline,
        CampaignROIInline,
        TargetHistoryInline,
    ]
from .models import Trend


@admin.register(Trend)
class TrendAdmin(admin.ModelAdmin):
    list_display = (
        "target",
        "period_label",
        "trend_value",
        "trend_status",
        "created_at",
    )

    list_filter = (
        "trend_status",
    )

    search_fields = (
        "target__name",
    )

    readonly_fields = ("created_at",)

admin.site.register(CampaignROI)
admin.site.register(TargetHistory)