# from rest_framework.routers import DefaultRouter
# from .views import (
#     AccessRuleViewSet,
#     WorkflowRuleViewSet,
#     ValidationRuleViewSet,
#     AssignmentRuleViewSet,
#     SecurityRuleViewSet,
# )

# router = DefaultRouter()
# router.register("access-rules", AccessRuleViewSet)
# router.register("workflow-rules", WorkflowRuleViewSet)
# router.register("validation-rules", ValidationRuleViewSet)
# router.register("assignment-rules", AssignmentRuleViewSet)
# router.register("security-rules", SecurityRuleViewSet)

# urlpatterns = router.urls


from django.urls import path
from .views import TenantRulesView

urlpatterns = [
    path("", TenantRulesView.as_view()),  # GLOBAL
    path("tenant/<uuid:tenant_id>/", TenantRulesView.as_view()),
]
