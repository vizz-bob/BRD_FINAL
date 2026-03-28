from django.db import models

class Lead(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(blank=True, null=True)
    mobile = models.CharField(max_length=20)
    source = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50, default="New")   # New, Contacted, Qualified, Converted
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "leads"

    def __str__(self):
        return self.name
