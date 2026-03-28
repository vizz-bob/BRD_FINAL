from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # authentication app
    path('api/auth/', include('authentication.urls')),

    # dashboard app
    path('api/dashboard/', include('Legal_Dashboard.dashboard.urls')),

    # document validation app
    path('api/document-validation/', include('Legal_Dashboard.Document_Validation.urls')),
    
    # agreement approvals app
    path('api/agreement-approvals/', include('Legal_Dashboard.Agreement_Approvals.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)