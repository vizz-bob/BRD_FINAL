from django.urls import path
from .views import OrganizationDetailsView,ChangePasswordView,SigninView,SignupView
#-------------------------
# Edit Profile
#---------------------------
urlpatterns = [
    path("organization-profile/", OrganizationDetailsView.as_view(), name="organization-profile"),
]
#--------------------------
# Change Password
#--------------------------
urlpatterns = [
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
#--------------------------
# Sign in
#----------------------------
urlpatterns = [
    path("signin/", SigninView.as_view(), name="signin"),
]
#-------------------------
# Sign up
#------------------------
urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
]