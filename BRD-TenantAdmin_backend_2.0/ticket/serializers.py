# from rest_framework import serializers
# from .models import Ticket


# class TicketSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Ticket
#         fields = (
#             'id',
#             'subject',
#             'category',
#             'priority',
#             'description',
#             'status',
#             'created_at',
#         )
#         read_only_fields = ('status', 'created_at')



from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at")