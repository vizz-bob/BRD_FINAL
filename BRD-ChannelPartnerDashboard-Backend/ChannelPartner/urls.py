"""
URL configuration for ChannelPartner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('dashboard.urls')),
    path('api/', include('update_agent.urls')),
    path('agent/', include('agent_performance.urls')), 
    path('performance/', include('performance_template.urls')),
    path('manage/',include('manage_tenants.urls')),
    path('letter/', include('Promotional_Offers.urls')),
    path('api/update/', include('update_payout.urls')),
    path('api/repayment/', include('repayment_recovery.urls')),
    path('api/', include('login.urls')),
    path('api/', include('signup.urls')),
  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)