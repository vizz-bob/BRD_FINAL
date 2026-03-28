from django.urls import path
from .views import kpis_and_charts

urlpatterns = [
    path("kpis-and-charts/", kpis_and_charts, name="kpis-and-charts"),
]