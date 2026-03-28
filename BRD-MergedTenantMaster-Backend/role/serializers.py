from rest_framework import serializers
from .models import Role

class RoleSerializer(serializers.ModelSerializer):
    # include loanmanagement fields dynamically if needed
    class Meta:
        model = Role
        fields = "__all__"
