from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Resource, ResourceCategory


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "type")
    list_filter = ("type",)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "file_type",
        "downloads",
        "created_at",
    )

    list_filter = ("file_type", "category")
    search_fields = ("title",)
    readonly_fields = ("downloads", "created_at")