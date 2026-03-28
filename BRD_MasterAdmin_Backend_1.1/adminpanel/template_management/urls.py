from rest_framework.routers import DefaultRouter
from .views import (
    PredefinedTemplateViewSet,
    CustomisedTemplateViewSet,
    FieldMasterViewSet,
)

router = DefaultRouter()
router.register("predefined-templates", PredefinedTemplateViewSet)
router.register("customised-templates", CustomisedTemplateViewSet)
router.register("field-masters", FieldMasterViewSet)

urlpatterns = router.urls
