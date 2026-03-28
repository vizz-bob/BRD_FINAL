from django.db import models

class ResourceCategory(models.Model):

    CATEGORY_CHOICES = [
        ("GUIDE", "Product Guides"),
        ("TRAINING", "Training Materials"),
        ("FORM", "Forms & Templates"),
        ("SUPPORT", "Support & Help"),
        ("QUICK", "Quick Links"),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name


class Resource(models.Model):

    FILE_TYPE_CHOICES = [
        ("PDF", "PDF"),
        ("DOCX", "DOCX"),
        ("VIDEO", "Video"),
        ("LINK", "Link"),
    ]

    category = models.ForeignKey(ResourceCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    file_type = models.CharField(max_length=20, choices=FILE_TYPE_CHOICES)

    file = models.FileField(upload_to="resources/files/", blank=True, null=True)
    external_link = models.URLField(blank=True, null=True)

    file_size = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)

    downloads = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title