#-------------------------
# Edit Profile
#---------------------------
from django.db import models
from django.contrib.auth.models import User
class OrganizationDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    organization_name = models.CharField(max_length=255, blank=True)
    organization_address = models.TextField(blank=True)
    contact_number = models.CharField(max_length=15, blank=True)
    email = models.CharField(max_length=20,blank=True)
    username = models.CharField(max_length=20,blank=True)
    email_user = models.CharField(max_length=20,blank=True)
    role = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    change_password = models.BooleanField(default=False)
    update_profile = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username
#--------------------------
# Change Password
#--------------------------
class ChangePassword(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    current_password = models.CharField(max_length=128)
    new_password = models.CharField(max_length=128)
    confirm_new_password = models.CharField(max_length=128)
    cancel = models.BooleanField(default=False)
    update_password = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Password Change - {self.user.username}"
#--------------------------
# Sign in
#-----------------------------
class Signin(models.Model):
    email = models.EmailField(max_length=100, blank=True)
    password = models.CharField(max_length=128, blank=True)
    remember_me = models.BooleanField(default=False)
    forgot_password = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.email
#-------------------------------
# Sign up
#--------------------------------
class Signup(models.Model):
    full_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=100, blank=True)
    password = models.CharField(max_length=128, blank=True)
    confirm_password = models.CharField(max_length=128)
    sign_up = models.BooleanField(default=False)
    def __str__(self):
        return self.full_name

    
