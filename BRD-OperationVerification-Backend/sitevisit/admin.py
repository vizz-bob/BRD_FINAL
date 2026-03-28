from django.contrib import admin
from .models import (
    SiteVisitReport,
    SiteVisitPhoto,
    Recommendation,
    Rejected
)


# -----------------------------
# Inline Models
# -----------------------------

class SiteVisitPhotoInline(admin.TabularInline):
    model = SiteVisitPhoto
    extra = 1


class RecommendationInline(admin.TabularInline):
    model = Recommendation
    extra = 1


# -----------------------------
# Site Visit Report
# -----------------------------

@admin.register(SiteVisitReport)
class SiteVisitReportAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "location",
        "visit_date",
        "status",
        "latitude",
        "longitude",
        "created_at",
        "photos_count",
    )
    list_filter = ("status", "visit_date")
    search_fields = ("title", "location", "observations")
    readonly_fields = ("created_at",)
    inlines = [SiteVisitPhotoInline, RecommendationInline]




# -----------------------------
# Site Visit Photo
# -----------------------------

@admin.register(SiteVisitPhoto)
class SiteVisitPhotoAdmin(admin.ModelAdmin):
    list_display = ("report", "uploaded_at")
    search_fields = ("report__title",)
    readonly_fields = ("uploaded_at",)


# -----------------------------
# Recommendation
# -----------------------------

@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ("text", "report")
    search_fields = ("text", "report__title")


# -----------------------------
# Rejected Documents
# -----------------------------

@admin.register(Rejected)
class RejectedAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "reason",
        "doc_type",
        "frequency",
        "created_at",
    )
    list_filter = ("doc_type", "created_at")
    search_fields = ("title", "reason", "description")
    readonly_fields = ("created_at",)