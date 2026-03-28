from django.db import models

# Create your models here.

#---------------------------
# Sign in
#--------------------------
class Sign_in(models.Model):
    email = models.EmailField(
        max_length=254,
        default="",          # 👈 important
        blank=True
    )
    password = models.CharField(
        max_length=128,
        default="",          # 👈 important
        blank=True
    )
    rememeber_me= models.BooleanField(default=False)
    sign_in = models.BooleanField(default=False)
    create_account = models.BooleanField(default=False)
