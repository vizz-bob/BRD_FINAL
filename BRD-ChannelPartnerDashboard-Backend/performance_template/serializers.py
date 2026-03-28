#-------------------------
# Dashboard
#-------------------------
from rest_framework import serializers
from .models import Dashboard


class DashboardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Dashboard
        fields = "__all__"
#---------------------
# New Template
#----------------------
from rest_framework import serializers
from .models import NewTemplate, PerformanceMetric


class PerformanceMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceMetric
        fields = "__all__"


class NewTemplateSerializer(serializers.ModelSerializer):
    metrics = PerformanceMetricSerializer(many=True)

    class Meta:
        model = NewTemplate
        fields = "__all__"

    def create(self, validated_data):
        metrics_data = validated_data.pop('metrics')
        template = NewTemplate.objects.create(**validated_data)

        for metric in metrics_data:
            PerformanceMetric.objects.create(template=template, **metric)

        return template