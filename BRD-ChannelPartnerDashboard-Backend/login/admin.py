from django.contrib import admin
from .models import Sign_in

# Register your models here.

#---------------------------
# Sign in
#--------------------------
@admin.register(Sign_in)
class SignInAdmin(admin.ModelAdmin):

    list_display = (
        'email',
        'rememeber_me',
        'sign_in',
        'create_account',
    )

    list_filter = (
        'rememeber_me',
        'sign_in',
        'create_account',
    )

    search_fields = (
        'email',
    )

    list_per_page = 20
