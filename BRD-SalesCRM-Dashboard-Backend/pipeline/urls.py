from rest_framework.routers import DefaultRouter
from .views import LeadViewSet,CRMToolViewSet

router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'crm-tools', CRMToolViewSet)

urlpatterns = router.urls