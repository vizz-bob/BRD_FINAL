from django.contrib import admin
from .models import OrganizationDetails,ChangePassword,Signin,Signup
#-------------------------
# Edit Profile
#---------------------------
@admin.register(OrganizationDetails)
class OrganizationDetailsAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "organization_name",
        "contact_number",
        "email",
        "username",
        "role",
        "department",
        "change_password",
        "update_profile",
        "updated_at",
    )
    search_fields = (
        "user__username",
        "organization_name",
        "contact_number",
        "email",
    )
    list_filter = ("role", "department", "change_password", "update_profile")
    readonly_fields = ("updated_at",)
#--------------------------
# Change Password
#--------------------------
@admin.register(ChangePassword)
class ChangePasswordAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "cancel",
        "update_password",
        "created_at",
    )
    list_filter = ("cancel", "update_password")
    search_fields = ("user__username",)
    readonly_fields = ("created_at",)
#--------------------------
# Sign in
#-----------------------------
@admin.register(Signin)
class SigninAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "remember_me",
        "forgot_password",
        "created_at",
    )
    list_filter = ("remember_me", "forgot_password")
    search_fields = ("email",)
    readonly_fields = ("created_at",)
#------------------------
# Sign up
#-------------------------
@admin.register(Signup)
class SignupAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "sign_up",
    )
    search_fields = ("full_name", "email")
    list_filter = ("sign_up",)