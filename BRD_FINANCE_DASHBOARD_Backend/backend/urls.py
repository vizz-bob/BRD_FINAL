from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from finance.views import SignupView

urlpatterns = [
    path('admin/', admin.site.urls),
    # authentication endpoints
    path('api/v1/auth/login/', obtain_auth_token, name='api_token_auth'),
    path('api/v1/auth/signup/', SignupView.as_view(), name='signup'),

    # finance-specific API
    path('api/v1/finance/', include(('finance.urls', 'finance'), namespace='finance')),
]
