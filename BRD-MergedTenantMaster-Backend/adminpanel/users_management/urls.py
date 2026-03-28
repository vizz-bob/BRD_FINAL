from django.urls import path
from .views import (
    AdminUserCreateAPIView,
    AdminUserListAPIView,
    AdminUserUpdateAPIView,
    AdminUserDetailAPIView,
)

urlpatterns = [
    path("create/", AdminUserCreateAPIView.as_view(), name="admin-user-create"),
    path("list/", AdminUserListAPIView.as_view(), name="admin-user-list"),
    path("list/<uuid:pk>/", AdminUserUpdateAPIView.as_view(), name="admin-user-edit"),
    path("<uuid:pk>/", AdminUserDetailAPIView.as_view(), name="admin-user-detail"),
]
