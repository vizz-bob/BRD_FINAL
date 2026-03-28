from rest_framework import serializers
from .models import KnowledgeResource

class KnowledgeResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeResource
        fields = "__all__"
