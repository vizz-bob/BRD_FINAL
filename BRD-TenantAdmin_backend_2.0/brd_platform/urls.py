from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.authtoken.views import obtain_auth_token
from .views import home
from user.views import login_view


admin.site.site_header = "Loan Administration"
admin.site.site_title = "Loan Admin Portal"
admin.site.index_title = "Welcome to Loan Admin Dashboard"

urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', obtain_auth_token, name='api_token_auth'),

    # ✅ Authentication (SESSION BASED)
    path('login/', login_view, name='login'),

    # ✅ App URLs
    path("api/v1/crm/", include("crm.urls")),
    path("api/v1/user/", include("user.urls")),  # ✅ Keep only this one
    path("api/v1/tenant/", include("tenants.urls")),
    path("api/v1/loan-collections/", include("loan_collections.urls")),
    path("api/v1/integrations/", include("integrations.urls")),
    path("api/v1/adminpanel/", include("adminpanel.urls")),
    path("api/v1/communications/", include("communications.urls")),
    path("api/v1/loan-accounts/", include("lms.urls")),
    path("api/v1/los/", include("los.urls")),
    path("api/v1/access_control/", include("access_control.urls")),
    path("api/v1/banking/", include("banking.urls")),
    path("api/v1/disbursement/", include("disbursement.urls")),
    path("api/v1/reporting/", include("reporting.urls")),
    path("api/v1/branches/", include("branches.urls")),
    path("api/v1/tenantuser/", include("tenantuser.urls")),
    path("api/v1/risk_engine/", include("risk_engine.urls")),
    path("api/v1/escalation/", include("escalation.urls")),
    path("api/v1/support/", include("ticket.urls")),
    path("api/v1/channel_partners/", include("channel_partners.urls")),
    path("api/v1/third_party/", include("partners.urls")),
    path("api/v1/role/", include("role.urls")),
    path("api/v1/product/", include("product.urls")),
    path("api/v1/rules/", include("engine.urls")),
    path("api/v1/internal/", include("internal.urls")),
    path("api/v1/finance/", include("finance.urls")),
    path("api/v1/subscriptions/", include("subscriptions.urls")),
    path("api/v1/businesses/", include("businesses.urls")),
    path("api/v1/system-settings/", include("system_settings.urls")),

    path("api/v1/finance/", include("finance.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
