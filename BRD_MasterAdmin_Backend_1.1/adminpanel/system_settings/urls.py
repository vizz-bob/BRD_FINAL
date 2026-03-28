from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register("languages", LanguageViewSet)
router.register("geo-locations", GeoLocationViewSet)
router.register("login-auth", LoginAuthenticationViewSet)
router.register("co-applicants", CoApplicantViewSet)
router.register("login-fees", LoginFeeViewSet)
router.register("joint-applicants", JointApplicantViewSet)
router.register("references", ReferenceViewSet)
router.register("verifications", VerificationViewSet)
router.register("application-process", ApplicationProcessViewSet)
router.register("score-card-ratings", ScoreCardRatingViewSet)

urlpatterns = router.urls
