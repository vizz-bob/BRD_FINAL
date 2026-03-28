from rest_framework import serializers


class OverviewSerializer(serializers.Serializer):
    lead_to_application_conversion = serializers.FloatField()
    average_time_to_submit = serializers.FloatField()
    win_rate = serializers.FloatField()


class WeeklyOverviewSerializer(serializers.Serializer):
    total_leads = serializers.IntegerField()
    applications = serializers.IntegerField()
    disbursed_amount = serializers.FloatField()


class TeamPerformanceSerializer(serializers.Serializer):
    name = serializers.CharField()
    leads = serializers.IntegerField()
    applications = serializers.IntegerField()
    conversion_rate = serializers.FloatField()


class WeeklyTrendSerializer(serializers.Serializer):
    week = serializers.CharField()
    leads = serializers.IntegerField()
    applications = serializers.IntegerField()
    conversion = serializers.FloatField()