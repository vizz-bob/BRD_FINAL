from django.urls import path,include
from .views import TenantUserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', TenantUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]



# urlpatterns = [
#     path("users/", TenantUserListView.as_view(), name="tenant-user-list"),
#     path("users/create/", TenantUserCreateView.as_view(), name="tenant-user-create"),
# ]
