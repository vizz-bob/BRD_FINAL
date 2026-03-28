from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from .models import *
from .serializers import *

class LanguageViewSet(ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAdminUser]


class GeoLocationViewSet(ModelViewSet):
    queryset = GeoLocation.objects.all()
    serializer_class = GeoLocationSerializer
    permission_classes = [IsAdminUser]


class LoginAuthenticationViewSet(ModelViewSet):
    queryset = LoginAuthentication.objects.all()
    serializer_class = LoginAuthenticationSerializer
    permission_classes = [IsAdminUser]


class CoApplicantViewSet(ModelViewSet):
    queryset = CoApplicant.objects.all()
    serializer_class = CoApplicantSerializer
    permission_classes = [IsAdminUser]


class LoginFeeViewSet(ModelViewSet):
    queryset = LoginFee.objects.all()
    serializer_class = LoginFeeSerializer
    permission_classes = [IsAdminUser]


class JointApplicantViewSet(ModelViewSet):
    queryset = JointApplicant.objects.all()
    serializer_class = JointApplicantSerializer
    permission_classes = [IsAdminUser]


class ReferenceViewSet(ModelViewSet):
    queryset = Reference.objects.all()
    serializer_class = ReferenceSerializer
    permission_classes = [IsAdminUser]


class VerificationViewSet(ModelViewSet):
    queryset = Verification.objects.all()
    serializer_class = VerificationSerializer
    permission_classes = [IsAdminUser]


class ApplicationProcessViewSet(ModelViewSet):
    queryset = ApplicationProcess.objects.all()
    serializer_class = ApplicationProcessSerializer
    permission_classes = [IsAdminUser]


class ScoreCardRatingViewSet(ModelViewSet):
    queryset = ScoreCardRating.objects.all()
    serializer_class = ScoreCardRatingSerializer
    permission_classes = [IsAdminUser]
