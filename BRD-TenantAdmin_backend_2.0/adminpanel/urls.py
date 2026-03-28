from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ChargeMasterViewSet,
    DocumentTypeViewSet,
    LoanProductViewSet,
    NotificationTemplateViewSet,
    RoleMasterViewSet,
    CouponViewSet,
    TenantSubscriptionView,
    DashboardFullView,
)

router = DefaultRouter()
router.register(r'charge-master', ChargeMasterViewSet)
router.register(r'document-types', DocumentTypeViewSet)
router.register(r'loan-products', LoanProductViewSet)
router.register(r'notification-templates', NotificationTemplateViewSet)
router.register(r'roles', RoleMasterViewSet)
router.register(r'coupons', CouponViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("tenant/subscription/", TenantSubscriptionView.as_view()),
    path("dashboard/", DashboardFullView.as_view()),
]
