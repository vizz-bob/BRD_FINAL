from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet, SubscriberViewSet

router = DefaultRouter()
router.register("plans", SubscriptionPlanViewSet)
router.register("subscribers", SubscriberViewSet)

urlpatterns = router.urls
