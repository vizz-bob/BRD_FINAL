from django.contrib import admin
from .models import (
    LoanImprovementRequest,
    InterestRateChange,
    TenureChange,
    EMIChange,
    ProductChange,
    FeeChange,
    CollateralChange,
    RepaymentRationalisation,
    InterestMoratorium,
    TopUpRequest,
)


@admin.register(LoanImprovementRequest)
class LoanImprovementRequestAdmin(admin.ModelAdmin):
    list_display = (
        "loan_id",
        "improvement_type",
        "status",
        "requested_by",
        "effective_date",
        "created_at",
    )
    list_filter = ("improvement_type", "status")
    search_fields = ("loan_id",)


admin.site.register(InterestRateChange)
admin.site.register(TenureChange)
admin.site.register(EMIChange)
admin.site.register(ProductChange)
admin.site.register(FeeChange)
admin.site.register(CollateralChange)
admin.site.register(RepaymentRationalisation)
admin.site.register(InterestMoratorium)
admin.site.register(TopUpRequest)
