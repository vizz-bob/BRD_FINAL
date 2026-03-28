
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/valuation/", include('valuation_dashboard.urls')),
    path('recent_valuation/', include('recent_valuation.urls')),
    path('api/field_valuation/', include('field_valuation.urls')),
    path("api/property_check/", include("property_check.urls")),
    path('api/user_profile/', include('user_profile.urls')),
    path('property_status/', include('property_status.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
