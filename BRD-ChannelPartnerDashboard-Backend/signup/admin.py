from django.contrib import admin
from .models import Create_Account

# Register your models here.

#---------------------------
# create Account
#---------------------------
@admin.register(Create_Account)
class CreateAccountAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        'full_name',
        'email',
        'phone',
        'role',
        'agree_terms',
        'create_account',
        'sign_in',
        'created_at',
    )

    list_filter = (
        'role',
        'agree_terms',
        'create_account',
        'sign_in',
        'created_at',
    )

    search_fields = (
        'user__username',
        'full_name',
        'email',
        'phone',
    )

    ordering = ('-created_at',)

    list_per_page = 20
