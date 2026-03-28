from rest_framework import serializers
from .models import ChannelPartner


class ChannelPartnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChannelPartner
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'created_by')

    def validate(self, data):
        role_type = data.get('role_type')
        company_name = data.get('company_name')

        if role_type == 'COMPANY' and not company_name:
            raise serializers.ValidationError(
                {"company_name": "Company name is required for company role"}
            )
        return data
