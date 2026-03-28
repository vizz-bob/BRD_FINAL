from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteVisitReportViewSet,
    SiteVisitPhotoViewSet,
    RecommendationViewSet,
    RejectedViewSet,
)

router = DefaultRouter()
router.register(r"site-visits", SiteVisitReportViewSet)
router.register(r"site-photos", SiteVisitPhotoViewSet)
router.register(r"recommendations", RecommendationViewSet)
router.register(r"rejections", RejectedViewSet)

urlpatterns = [
    path("", include(router.urls)),
]