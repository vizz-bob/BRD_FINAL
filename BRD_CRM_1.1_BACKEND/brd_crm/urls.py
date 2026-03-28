from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("campaignss/", include("campaignss.urls")),
    path("corecrm/", include("corecrm.urls")),
    path("Finance_And_Analytics/", include("Finance_And_Analytics.urls")),
    path("Support_And_Operations/", include("Support_And_Operations.urls")),
    path("pipeline/", include("pipeline.urls")),
    path('hot_lead/', include('hot_lead.urls')),
    path('conversion_board/', include('conversion_board.urls')),
    path('qualified_leads/', include('qualified_leads.urls')),
    path("checked_lead/", include("checked_lead.urls")),
    path('leads/', include('leads.urls')),
    path('bulk_upload/', include('bulk_upload.urls')),
    path('data-ingestion/', include('data_ingestion.urls')),
    path('data_lead/', include('data_lead.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )