from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, AuditLogViewSet, SignupView, CurrentUserView, ChangePasswordView, Setup2FAView, Verify2FAView, Disable2FAView, LoginActivityListAPIView, Verify2FALoginView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    # ✅ Signup Endpoint
    path('signup/', SignupView.as_view(), name='signup'),

    path('me/', CurrentUserView.as_view(), name='current-user'),  # ✅ Add this
    path('change-password/',ChangePasswordView.as_view(), name='change-password'),
    path("2fa/setup/", Setup2FAView.as_view(), name="setup-2fa"),
    path("2fa/verify/", Verify2FAView.as_view(), name="verify-2fa"),
    path("2fa/disable/", Disable2FAView.as_view(), name="disable-2fa"),
    path("2fa/login/", Verify2FALoginView.as_view()),
    path("login-activity/", LoginActivityListAPIView.as_view(), name="login-activity"),
    # Default Router URLs
    path('', include(router.urls)),

]