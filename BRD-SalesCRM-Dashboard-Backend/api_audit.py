from django.urls import resolve
from django.test import RequestFactory
from django.contrib.auth.models import User
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sales_crm_dashboard.settings")
django.setup()

rf = RequestFactory()
user = User.objects.get(username="admin")
urls = [
    "/api/dashboard/metrics/",
    "/api/reports/",
    "/api/reports/weekly/",
    "/api/incentives/",
    "/api/incentives/summary/",
    "/api/incentives/current/",
    "/api/incentives/history/",
]

for url in urls:
    try:
        match = resolve(url)
        request = rf.get(url)
        request.user = user
        # Handle viewsets
        if hasattr(match.func, "cls"):
            view = match.func.cls.as_view(match.func.actions)
            response = view(request, **match.kwargs)
        else:
            response = match.func(request, **match.kwargs)
        print(f"{url}: {response.status_code}")
        if response.status_code == 400:
            print(f"Data: {response.data}")
    except Exception as e:
        print(f"{url} ERROR: {e}")
