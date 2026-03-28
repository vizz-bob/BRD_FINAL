from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConcessionTypeViewSet, ConcessionCategoryViewSet

router = DefaultRouter()

router.register(
    r"concession-types",
    ConcessionTypeViewSet,
    basename="concession-type"
)

router.register(
    r"concession-categories",
    ConcessionCategoryViewSet,
    basename="concession-category"
)

urlpatterns = [
    path("", include(router.urls)),
]
