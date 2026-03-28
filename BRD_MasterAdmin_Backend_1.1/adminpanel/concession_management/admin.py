from django.contrib import admin
from .models import ConcessionType, ConcessionCategory

admin.site.register(ConcessionType)
admin.site.register(ConcessionCategory)
