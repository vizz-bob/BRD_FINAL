from django.contrib import admin
from .models import FileUpload, ManualEntry, FtpIntegration, ApiIntegration


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "product_selection",
        "assign_agent",
        "enable_duplicate_check",
        "consent_obtained",
        "overwrite_existing_data",
    )
    list_filter = ("product_selection", "assign_agent", "enable_duplicate_check")
    search_fields = ("product_selection", "assign_agent")
    ordering = ("-id",)


@admin.register(ManualEntry)
class ManualEntryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "mobile_number",
        "email",
        "product_selection",
        "country",
        "state",
        "city",
    )
    list_filter = ("product_selection", "country", "state", "city")
    search_fields = ("name", "mobile_number", "email")
    ordering = ("-id",)


@admin.register(FtpIntegration)
class FtpIntegrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "configuration_name",
        "ftp_host",
        "port",
        "username",
        "frequency",
        "time",
    )
    list_filter = ("frequency",)
    search_fields = ("configuration_name", "username", "ftp_host")
    ordering = ("-id",)

    fieldsets = (
        ("Basic Information", {
            "fields": ("configuration_name", "frequency", "time")
        }),
        ("FTP Credentials", {
            "fields": ("ftp_host", "port", "username", "password", "remote_path")
        }),
    )


@admin.register(ApiIntegration)
class ApiIntegrationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "configuration_name",
        "api_endpoint_url",
        "http_method",
        "auth_type",
        "sync_schedule",
    )
    list_filter = ("http_method", "auth_type", "sync_schedule")
    search_fields = ("configuration_name", "api_endpoint_url")
    ordering = ("-id",)

    fieldsets = (
        ("Basic Configuration", {
            "fields": ("configuration_name", "sync_schedule")
        }),
        ("API Details", {
            "fields": ("api_endpoint_url", "http_method")
        }),
        ("Authentication", {
            "fields": ("auth_type", "api_key", "header_key", "header_value")
        }),
    )
