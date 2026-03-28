from rest_framework import serializers
from .models import OrganizationDetails,ChangePassword,Signin,Signup
#-------------------------
# Edit Profile
#---------------------------
class OrganizationDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationDetails
        fields = "__all__"
        read_only_fields = ("updated_at",)
#--------------------------
# Change Password
#--------------------------
class ChangePasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChangePassword
        fields = "__all__"
        read_only_fields = ("created_at",)

    def validate(self, data):
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError(
                {"confirm_new_password": "Passwords do not match"}
            )
        return data
#--------------------------
# Sign in
#----------------------------
class SigninSerializer(serializers.ModelSerializer):

    class Meta:
        model = Signin
        fields = "__all__"
        read_only_fields = ("created_at",)
#-----------------------
# Sign up
#--------------------------
class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signup
        fields = "__all__"
    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match"}
            )
        return data